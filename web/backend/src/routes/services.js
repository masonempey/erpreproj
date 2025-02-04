const express = require("express");
const router = express.Router();
const Services = require("../models/serviceModel");
const logger = require("../middleware/logger");

// Setup middleware to use the logger function for my routes
router.use(logger);

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Services.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Cannot find barbers", err });
  }
});

// Create New Service
router.post("/", async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;

    if (!serviceName || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new Services({
      serviceName,
      description,
      price,
    });

    const savedService = await newService.save();
    res.status(201).json({ message: "Service created", savedService });
  } catch (err) {
    res.status(500).json({ message: "Cannot find services", err });
  }
});

// Delete Service by id
router.delete("/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;

    const foundService = await Services.findByIdAndDelete(serviceId);
    if (foundService) {
      res.status(200).json({ message: "Service Deleted" });
    } else {
      res
        .status(404)
        .json("Cannot delete service, no service found by id of", serviceId);
    }
  } catch {
    res
      .status(500)
      .json({ message: "Error deleting service", error: err.message });
  }
});

// Edit service by id
router.put(":/serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { serviceName, description, price } = req.body;

    const updatedService = await Services.findByIdAndUpdate(
      serviceId,
      { serviceName, description, price },
      { new: true }
    );

    if (updatedService) {
      res.status(200).json({ message: "Service Updated", updatedService });
    } else {
      res
        .status(404)
        .json("Cannot update service, no service found by id of", serviceId);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating service", error: err.message });
  }
});

module.exports = router;
