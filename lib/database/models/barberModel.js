import mongoose from "mongoose";

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

export default mongoose.models.Barber || mongoose.model("Barber", BarberSchema);
