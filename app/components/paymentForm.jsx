import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function PaymentForm({ onSuccess, isProcessing, serverError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(""); // Renamed to avoid collision with prop
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Don't process if already processing from parent
    if (isProcessing) return;

    setLoading(true);
    setCardError("");

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          address: {
            postal_code: postalCode,
          },
        },
      });

      if (error) {
        setCardError(error.message);
        return;
      }

      // If card is valid, proceed to next step
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setCardError("Card validation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        color: "#35281f",
        "::placeholder": {
          color: "rgba(53, 40, 31, 0.5)",
        },
      },
    },
    hidePostalCode: true,
  };

  // Display either server error or card validation error
  const displayedError = serverError || cardError;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
        You will only be charged in case of a no-show or late cancellation.
      </Typography>

      {displayedError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {displayedError}
        </Alert>
      )}

      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(53, 40, 31, 0.2)",
          borderRadius: 1,
          mb: 2,
          "& .StripeElement": {
            padding: "10px",
            backgroundColor: "white",
          },
          "& .StripeElement--focus": {
            borderColor: "#35281f",
            boxShadow: "0 0 0 2px rgba(53, 40, 31, 0.2)",
          },
        }}
      >
        <CardElement options={cardElementOptions} />
      </Box>

      <TextField
        id="postalCode"
        label="Postal Code"
        variant="outlined"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
        fullWidth
        error={!!cardError}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#35281f",
            },
          },
          "& label.Mui-focused": {
            color: "#35281f",
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || loading || isProcessing}
        sx={{
          mt: 2,
          backgroundColor: "#35281f",
          color: "#fafafa",
          "&:hover": {
            backgroundColor: "#fafafa",
            color: "#35281f",
          },
        }}
      >
        {loading || isProcessing ? "Processing..." : "Submit Payment Details"}
      </Button>

      {success && !serverError && (
        <Typography color="success" sx={{ mt: 2 }}>
          Payment details saved successfully!
        </Typography>
      )}
    </Box>
  );
}
