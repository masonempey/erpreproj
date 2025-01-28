const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const logger = require("../middleware/logger");

///Setup middleware to use the logger function for my routes
router.use(logger);

// Get All Appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).send(appointments);
    if (!appointments) {
      res.status(400).send("Could not find any appointments");
    }
  } catch (err) {
    res
      .status(500)
      .send("Error occurred while attempting to find all appointments");
  }
});

// Create new appointment
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
    } = req.body;

    if (
      !customerName ||
      !barberName ||
      !date ||
      !time ||
      !userId ||
      !barberId ||
      !serviceType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new appointment object
    const newAppointment = new Appointment({
      customerName,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
    });

    const appointmentCreated = await newAppointment.save();

    try {
      await User.findByIdAndUpdate(
        userId,
        { $push: { appointments: appointmentCreated._id } },
        { new: true, useFindAndModify: false }
      );
    } catch (err) {
      console.error("Error finding user to insert appointment:", err);
      res
        .status(500)
        .send(
          "Error occurred while attempting to create an appointment for the user"
        );
    }

    res.status(200).json({ message: "appointment created" });
    console.log("appointment created for", customerName);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res
      .status(500)
      .send(
        "Error occurred while attempting to create an appointment for the user"
      );
  }
});

// Get Appointments under a specific user
router.get("/users/:userId/appointments", async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching appointments for user ID: ${userId}`);
  try {
    // Reference: GPT 4o, used insight on searching for the appointments that have the correct userId
    const appointments = await Appointment.find({ userId: userId });
    console.log(`Appointments found: ${appointments.length}`);
    // If the appointments under the user is 0 (No appointments)
    if (appointments.length === 0) {
      return res.status(404).send("No appointments found for this user");
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .send(
        "Error occurred while attempting to find appointments for the user"
      );
  }
});

// Delete Appointment by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete appointment of ID: ${id}`);
  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (appointment) {
      return res.status(200).send("Appointment Deleted successfully");
    } else {
      return res.status(404).send("No appointment found with this ID");
    }
  } catch (err) {
    console.error("Error deleting appointment", err);
    res
      .status(500)
      .send("Error occurred while attempting to delete appointment");
  }
});

// Update Appointment by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    barberName,
    date,
    time,
    userId,
    barberId,
    serviceType,
  } = req.body;

  // Checks for at least one field in the body
  if (
    !customerName &&
    !barberName &&
    !date &&
    !time &&
    !userId &&
    !barberId &&
    !serviceType
  ) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        $set: {
          customerName,
          barberName,
          date,
          time,
          userId,
          barberId,
          serviceType,
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: err.message });
  }
});

module.exports = router;
