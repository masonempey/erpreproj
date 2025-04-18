// components/PaymentForm.jsx

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useBooking } from "../../context/BookingContext";
import { useUser } from "../../context/UserContext";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { state, dispatch, createAppointment } = useBooking();
  const { user } = useUser();

  // Coerce servicePrice into a number (fallback to 0)
  const price = Number(state.servicePrice) || 0;
  const amount = Math.round(price * 100);

  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);

  // Create PaymentIntent once we have a positive amount
  useEffect(() => {
    if (amount <= 0) return;
    axios
      .post("/api/stripe", { action: "stripe", amount })
      .then(({ data }) => setClientSecret(data.clientSecret))
      .catch((err) =>
        setCardError(
          err.response?.data?.error || "Failed to initialize payment"
        )
      );
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !stripe || !elements) return;

    setLoading(true);
    setCardError("");

    try {
      // 1) Create PaymentMethod
      const cardEl = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardEl,
        billing_details: { name: user?.displayName || "Guest" },
      });
      if (pmError) throw pmError;

      // 2) Confirm the PaymentIntent
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
      if (confirmError) throw confirmError;

      // 3) Create the appointment, passing the intent ID
      const result = await createAppointment({
        paymentIntentId: paymentIntent.id,
      });
      dispatch({ type: "BOOKING_SUCCESS", payload: result.appointment });
    } catch (err) {
      console.error("Payment/booking error:", err);
      setCardError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
      {/* Decorative card */}
      <Grid item xs={12} md={5}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(145deg,#35281f 0%,#5d4c40 100%)",
            color: "white",
            height: 220,
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.7 }}>
            PAYMENT DETAILS
          </Typography>
          <Box
            sx={{
              my: 4,
              fontFamily: "'Courier New',monospace",
              letterSpacing: 2,
            }}
          >
            •••• •••• •••• ••••
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">
              {user?.displayName || "Card Holder"}
            </Typography>
            <Typography variant="body2">MM/YY</Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Payment form */}
      <Grid item xs={12} md={7}>
        <Stack spacing={3}>
          <Typography variant="h6">Payment Information</Typography>

          {cardError && <Alert severity="error">{cardError}</Alert>}

          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: cardError ? "error.main" : "divider" }}
          >
            <CardElement options={{ hidePostalCode: true }} />
          </Paper>

          <Divider />

          <Typography>
            Amount: <strong>${price.toFixed(2)}</strong>
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => dispatch({ type: "GO_BACK" })}
              sx={{ flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!clientSecret || loading}
              sx={{ flex: 2 }}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Processing…" : "Pay & Confirm"}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
