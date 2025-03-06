import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function PaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

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
        setError(error.message);
        return;
      }

      // If card is valid, proceed to next step
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError("Card validation failed. Please try again.");
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
        error={!!error}
        helperText={error}
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
        disabled={!stripe || loading}
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
        {loading ? "Processing..." : "Submit Payment Details"}
      </Button>

      {success && (
        <Typography color="success" sx={{ mt: 2 }}>
          Payment details saved successfully!
        </Typography>
      )}
    </Box>
  );
}
