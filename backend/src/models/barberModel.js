const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema({
  barberId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Barber", BarberSchema);
