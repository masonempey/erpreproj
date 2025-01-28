const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  barberName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber",
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
