const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("../models/roleModel");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const roles = [
      { roleType: "Admin" },
      { roleType: "Barber" },
      { roleType: "Customer" },
    ];

    return Role.insertMany(roles);
  })
  .then(() => {
    console.log("Roles inserted");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting roles", err);
    mongoose.connection.close();
  });
