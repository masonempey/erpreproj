const mongoose = require("mongoose");

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

module.exports = mongoose.model("AuthToken", AuthTokenSchema);
