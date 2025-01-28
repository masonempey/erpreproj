const express = require("express");
const router = express.Router();
const Barber = require("../models/barberModel");
const logger = require("../middleware/logger");
const { v4: uuidv4 } = require("uuid");

// Setup middleware to use the logger function for my routes
router.use(logger);

// Get all barbers
router.get("/", async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.status(200).json(barbers);
  } catch (err) {
    res.status(500).json({ message: "Cannot find barbers", err });
  }
});

// Create New Barber
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBarber = new Barber({
      // Creates unique barberId using uuidv4 library
      barberId: uuidv4(),
      name,
      email,
    });

    const savedBarber = await newBarber.save();
    res.status(201).json({ message: "Barber created", savedBarber });
  } catch (err) {
    res.status(500).json({ message: "Error creating barber", err });
  }
});

// Delete Barber by id
router.delete("/:barberId", (req, res) => {
  const { barberId } = params.barberId;

  try {
    const foundBarber = Barber.findByIdAndDelete(barberId);
    if (foundBarber) {
      res.status(200).json({ message: "Barber Deleted" });
    } else {
      res
        .status(404)
        .json("Cannot delete barber, no barber found by id of", id);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting barber", error: err.message });
  }
});

// Update barber by id
router.put("/:barberId", async (req, res) => {
  const { barberId } = req.params;
  const { name, email } = req.body;

  // Checks for name or email in body
  if (!name && !email) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  try {
    // Updates the barber in mongodb using its id
    const updatedBarber = await Barber.findByIdAndUpdate(
      barberId,
      { $set: { name, email } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedBarber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res
      .status(200)
      .json({ message: "Barber updated successfully", barber: updatedBarber });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating barber", error: err.message });
  }
});

module.exports = router;
