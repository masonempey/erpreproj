const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const logger = require("../middleware/logger");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

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

//Creates new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, roleId, phoneNumber } = req.body;

    if (!email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Generate a hashedPassword (encrypted) from the users given password
    const hashedPassword = await bcrypt.hash(password, 10);

    //find the default role
    const defaultRole = await Role.findOne({ roleType: "Customer" });

    //Create the newUser
    const newUser = new User({
      //Using uuidv4 we can create a unique userId and assign that to the user
      userId: uuidv4(),
      email,
      password: hashedPassword,
      //If no role given then select the default role via its objectId
      roleId: roleId ? mongoose.Types.ObjectId(roleId) : defaultRole._id,
      phoneNumber,
    });
    //Save the user to the mongoDB
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Creating User", error: err.message });
  }
});

//Gets user by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Gets the user from mongo by id
    const userFound = await User.findById(id);
    if (userFound) {
      res.status(200).json(userFound);
    }
  } catch (err) {
    res.status(500).json({ message: "Cannot Find User by id of", id });
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
