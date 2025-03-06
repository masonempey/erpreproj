const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const logger = require("../middleware/logger");
const mongoose = require("mongoose");
const admin = require("../middleware/firebase-admin");

//Setup middleware to use the logger function for my routes
router.use(logger);

// Gets all users
router.get("/", async (req, res) => {
  try {
    // Gets all users from mongo
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Fetching Users", error: err.message });
  }
});
// Check if user that login with google exist?
router.post("/validate", async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ userId: uid });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    res
      .status(500)
      .json({ message: "Error checking user", error: error.message });
  }
});

// Create google users with no password and phone number
router.post("/googleregister", async (req, res) => {
  try {
    const { email, uid, name, phoneNumber } = req.body;

    if (!email || !uid || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user in MongoDB
    const defaultRole = await Role.findOne({ roleType: "Customer" });
    const newUser = new User({
      userId: uid,
      email,
      name,
      lastLogin: new Date(),
      roleId: defaultRole ? defaultRole._id : null,
      phoneNumber: phoneNumber || "",
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", userId: uid });
  } catch (error) {
    console.error("Error in /register/google route:", error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

//Creates new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // error handling if users register with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      // create new users on firebase auth
      const firebaseUser = await admin.auth().createUser({
        email,
        password,
      });

      // get the firebase uid
      const firebaseUID = firebaseUser.uid;
      const defaultRole = await Role.findOne({ roleType: "Customer" });

      // create new users in mongodb using uid from firebase auth
      // since we don't have user name right now so I just assign the name is the email
      // phone number is required
      const newUser = new User({
        userId: firebaseUID,
        email,
        name: email,
        lastLogin: new Date(),
        roleId: defaultRole ? defaultRole._id : null,
        phoneNumber: phoneNumber || "",
      });

      await newUser.save();
      return res
        .status(201)
        .json({ message: "User created successfully", userId: firebaseUID });
    } catch (firebaseError) {
      console.error("Error creating user in Firebase:", firebaseError);
      return res.status(500).json({
        message: "Error creating user in Firebase",
        error: firebaseError.message,
      });
    }
  } catch (err) {
    console.error("Error in /register route:", err);
    return res
      .status(500)
      .json({ message: "Error Creating User", error: err.message });
  }
});

//Gets user by id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the user by userId in the database
    const userFound = await User.findOne({ userId: userId });

    if (userFound) {
      res.status(200).json(userFound);
    } else {
      res.status(404).json({ message: `User with userId ${userId} not found` });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

//Update by increasing the user coins
router.patch('/:userId/coins', async (req, res) => {
  try {
    const { userId } = req.params;
    const { coins } = req.body;

    // Validate input
    if (typeof coins !== 'number' || coins < 0) {
      return res.status(400).json({ error: 'Invalid coins value' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { $inc: { coins: coins } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating coins:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to redeem and deduct coins
router.patch('/:userId/coins/redeem', async (req, res) => {
  try {
    const { userId } = req.params;
    const { coins } = req.body;

    // Validate input
    if (typeof coins !== 'number' || coins < 0) {
      return res.status(400).json({ error: 'Invalid coins value' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { $inc: { coins: -coins } },  // Subtract coins here
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating coins:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//deletes user by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Deletes the user from mongo by id
    // Reference: https://stackoverflow.com/questions/71013148/im-not-sure-how-to-delete-a-user-using-mongodb
    const userFound = await User.findByIdAndDelete(id);
    if (userFound) {
      res.status(200).json("User Deleted by id of", id);
    } else {
      res.status(400).json("Cannot delete user, no user found by id of", id);
    }
  } catch (err) {
    res.status(500).json({ message: "Cannot Find User by id of", id });
  }
});

//Update user by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password, roleId, phoneNumber } = req.body;

  // Checks for name or email in body
  if (!email && !password && !roleId && !phoneNumber) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  try {
    const updatedUser = await Barber.findByIdAndUpdate(
      id,
      { $set: { email, password, roleId, phoneNumber } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});


module.exports = router;
