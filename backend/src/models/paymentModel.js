const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
