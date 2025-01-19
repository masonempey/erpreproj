const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
