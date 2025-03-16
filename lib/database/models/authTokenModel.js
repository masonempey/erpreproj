import mongoose from "mongoose";

const AuthTokenSchema = new mongoose.Schema({
  authToken: {
    type: String,
    required: true,
  },
  tokenExpiry: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.AuthToken ||
  mongoose.model("AuthToken", AuthTokenSchema);
