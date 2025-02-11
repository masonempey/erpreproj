const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const PLACE_ID = process.env.PLACE_ID;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

router.use(logger);


router.get("/", async (req, res) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await axios.get(url);
    const reviews = response.data
    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;