"use client";

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
  TextField,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useBooking } from "../../../../context/BookingContext";
import { useUser } from "../../../../context/UserContext";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { state, dispatch, createAppointment } = useBooking();
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const price = Number(state.servicePrice) || 0;
  const amount = Math.round(price * 100);
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState("");

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
      const {
        error: pmError,
        paymentMethod,
      } = await stripe.createPaymentMethod({
        type: "card",
        card: cardEl,
        billing_details: {
          name: state.personalInfo.fullName,
          email: state.personalInfo.email,
          address: { postal_code: postalCode },
        },
      });
      if (pmError) throw pmError;

      // 2) Confirm the PaymentIntent
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
      if (confirmError) throw confirmError;

      // 3) Create the appointment
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
    <Box sx={{ maxWidth: 800, mx: "auto", px: isMobile ? 1 : 2 }}>
      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 0,
              borderRadius: 2,
              overflow: "hidden",
              background: "linear-gradient(145deg,#35281f 0%,#5d4c40 100%)",
              color: "white",
              height: { xs: "160px", sm: "180px" },
              position: "relative",
              mb: { xs: 2, md: 0 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.7,
                  fontSize: isMobile ? "0.6rem" : "0.7rem",
                }}
              >
                Payment Details
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  letterSpacing: 2,
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                }}
              >
                •••• •••• •••• ••••
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: isMobile ? "0.65rem" : "0.7rem",
                    }}
                  >
                    CARD HOLDER
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isMobile ? "0.75rem" : "0.8rem",
                    }}
                  >
                    {state.personalInfo.fullName || "Your Name"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: isMobile ? "0.65rem" : "0.7rem",
                    }}
                  >
                    EXPIRY
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isMobile ? "0.75rem" : "0.8rem",
                    }}
                  >
                    MM/YY
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{ mb: 1.5, fontSize: isMobile ? "1.1rem" : "1.25rem" }}
            >
              Payment Details
            </Typography>

            {cardError && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {cardError}
              </Alert>
            )}

            <Paper
              variant="outlined"
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderColor: cardError ? "error.main" : "divider",
                mb: 2,
              }}
            >
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: isMobile ? "14px" : "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </Paper>

            <TextField
              fullWidth
              label="Postal Code"
              placeholder="A1A 1A1"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
              helperText="Canadian postal code"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography>
                Amount: <strong>${price.toFixed(2)}</strong>
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !clientSecret}
                startIcon={<LockIcon />}
                sx={{
                  bgcolor: "#35281f",
                  py: { xs: 1, sm: 1.5 },
                  "&:hover": { bgcolor: "#4a3c32" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Pay $${price.toFixed(2)} & Confirm`
                )}
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                bgcolor: "rgba(0,0,0,0.02)",
              }}
            >
              <Image
                src="/images/stripe-logo.png"
                alt="Stripe"
                width={60}
                height={21}
              />
              <Typography variant="body2" color="text.secondary">
                Secure payments by Stripe. We don't store your card details.
              </Typography>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}
