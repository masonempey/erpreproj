/**
 * Consolidated API for all payment operations.
 * This file handles payment processing and related functionality.
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST request handler with different actions:
 * /api/payments (with action: "stripe") - create a Stripe payment intent
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action = "stripe", ...data } = body;

    switch (action) {
      case "stripe":
        return await createStripePaymentHandler(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment request" },
      { status: 500 }
    );
  }
}

// Helper functions
async function createStripePaymentHandler(data) {
  const { amount } = data;

  if (!amount) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
}
