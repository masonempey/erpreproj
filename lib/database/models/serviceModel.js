import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Price in cents
    required: true,
  },
});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
