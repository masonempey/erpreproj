const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// Load Environment Variables from the .ENV File
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;



//Allow express to read JSON data from body
app.use(express.json());
//Enables cors for any requests coming from the frontend origin
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//Connect to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.status(400).send("Welcome To our Server!");
});

// Import Routes
const appointmentRoutes = require("./routes/appointments");
const userRoutes = require("./routes/users");
const barberRoutes = require("./routes/barbers");
const serviceRoutes = require("./routes/services");
const stripeRoutes = require("./routes/stripe");
const reviewRoutes = require("./routes/reviews");

// Use Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payment", stripeRoutes);
app.use("/api/reviews", reviewRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
