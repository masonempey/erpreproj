const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const dotenv = require("dotenv");

// Load Environment Variables from the .env File
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/", (req, res) => {
  res.status(200).send("Welcome to the Stripe API!");
});

// Create a payment intent
router.post("/payment", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
