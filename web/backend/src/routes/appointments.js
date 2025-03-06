const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Service = require("../models/serviceModel");
const logger = require("../middleware/logger");
const { sendConfirmationEmail, sendNewsletter } = require("../routes/email");

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
      email,
      barberName,
      date,
      time,
      userId,
      barberId,
      serviceType,
      guestDetails,
    } = req.body;

    console.log("Request payload:", req.body);

    if (!barberName || !date || !time || !barberId || !serviceType) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = await Service.findOne({ serviceName: serviceType });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    // COPILOT REFERENCE: Prompt: use the data and time and combine them to create 1 total date time object
    const dateTime = new Date(date);
    const [timeHour, timeMinute] = time.split(/[: ]/);
    let hour = parseInt(timeHour);
    if (time.includes("PM") && hour !== 12) {
      hour += 12;
    } else if (time.includes("AM") && hour === 12) {
      hour = 0;
    }
    dateTime.setUTCHours(hour);
    dateTime.setUTCMinutes(parseInt(timeMinute));

    // Create a new appointment object
    const newAppointment = new Appointment({
      customerName,
      barberName,
      date: dateTime,
      userId,
      barberId,
      services: [service._id],
      guestDetails,
    });

    const appointmentCreated = await newAppointment.save();

    if (userId) {
      try {
        await User.findOneAndUpdate(
          { userId: userId },
          { $push: { appointments: appointmentCreated._id } },
          { new: true, useFindAndModify: false }
        );
      } catch (err) {
        console.error("Error finding user to insert appointment:", err);
      }
    }

    try {
      const confirmationAppointment = {
        customerName: customerName,
        email: email,
        barberName: barberName,
        date: dateTime,
        serviceType: serviceType,
        guestDetails: guestDetails,
      };
      await sendConfirmationEmail(confirmationAppointment);
      const newsLetterData = {
        recipientEmail: email,
        customerName: customerName,
      };
      await sendNewsletter(newsLetterData);
      console.log("Confirmation email sent successfully");
    } catch (emailErr) {
      console.error("Error sending confirmation email:", emailErr);
    }
  } catch (err) {
    console.error("Error creating appointment:", err);
    res
      .status(500)
      .send("Error occurred while attempting to create an appointment");
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

// Get Appointments under a specific barber -- Simon -- Mason Assisted
router.get("/barbers/:barberId", async (req, res) => {
  const { barberId } = req.params;
  console.log(`Fetching appointments for barber ID: ${barberId}`);
  console.log(`Barber ID: ${barberId}`);

  try {
    const appointments = await Appointment.find({ barberId: barberId });
    console.log(`Appointments found: ${appointments.length}`);
    // If the appointments under the user is 0 (No appointments)
    if (appointments.length === 0) {
      return res.status(404).send("No appointments found for this barber");
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .send(
        "Error occurred while attempting to find appointments for the barber"
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
        //Mongo update operator ($set) to update the fields
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

    res.status(200).json({
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
