const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: false,
  },
  barberId: {
    type: String,
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
