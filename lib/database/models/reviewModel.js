import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
