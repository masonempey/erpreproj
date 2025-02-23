const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
      unique: false,
    },
    lastLogin: {
      type: Date,
      required: false,
      unique: false,
    },
    // NOTE: I make this field optional since sign in with google is not give us phone number need to find someway
    phoneNumber: {
      type: String,
      required: false,
      default: ""
    },
    address: {
      type: String,
      required: false,
      unique: false,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);