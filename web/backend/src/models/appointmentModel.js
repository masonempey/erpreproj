const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber",
    required: true,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  guestDetails: {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
