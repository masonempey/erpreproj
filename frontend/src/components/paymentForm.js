"use client";

import React from "react";
import { useState } from "react";
// Stripes libraries
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Submitting payment form...");

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // GPT 4o, Helped created various parts of these methods for Strip service.
    // Along with https://medium.com/@hikmatullahmcs/here-is-a-step-by-step-guide-on-how-to-integrate-stripe-with-a-node-js-77a25adf7064
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        address: {
          postal_code: postalCode,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    const response = await fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 5000 }),
    });

    const { clientSecret } = await response.json();

    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id,
      }
    );

    if (confirmError) {
      setError(confirmError.message);
      return;
    }

    setSuccess(true);
    onSuccess();
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true, // Hide the default ZIP code field
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardElementOptions} />
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {success && <div>Payment successful!</div>}
    </form>
  );
};

export default PaymentForm;
