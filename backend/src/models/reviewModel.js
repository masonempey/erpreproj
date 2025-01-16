const mongoose = require("mongoose");

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

module.exports = mongoose.model("Review", ReviewSchema);
