import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  TextField,
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
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const { state, dispatch, createAppointment } = useBooking();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setCardError("");

    if (!stripe || !elements) {
      setLoading(false);
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
        setLoading(false);
        return;
      }

      try {
        const appointmentResult = await createAppointment();
        console.log("Appointment created:", appointmentResult);

        // Handle success - move to confirmation step
        dispatch({
          type: "BOOKING_SUCCESS",
          payload: appointmentResult.appointment,
        });
      } catch (err) {
        console.error("Booking error:", err);
        setCardError(err.message || "Failed to create appointment");
      }
    } catch (err) {
      setCardError(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    dispatch({ type: "GO_BACK" });
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ maxWidth: 800, mx: "auto", mt: 2, px: 2 }}
    >
      <Grid item xs={12} md={5}>
        <Paper
          elevation={3}
          sx={{
            p: 0,
            borderRadius: 2,
            overflow: "hidden",
            background: "linear-gradient(145deg, #35281f 0%, #5d4c40 100%)",
            height: "220px",
            color: "white",
            position: "relative",
            transform: "perspective(1000px) rotateY(0deg)",
            transition: "transform 0.6s ease",
            mb: { xs: 3, md: 0 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Payment Details
              </Typography>
            </Box>

            <Box sx={{ my: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: 2,
                }}
              >
                •••• •••• •••• ••••
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
                {user?.displayName || "Card Holder"}
              </Typography>
              <Typography variant="body2">MM/YY</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Stack spacing={3}>
          <Typography variant="h6" color="primary.main">
            Payment Information
          </Typography>

          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              p: 2,
              borderColor: cardError ? "error.main" : "divider",
              transition: "border-color 0.3s ease",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </Paper>

          <TextField
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            variant="outlined"
            size="medium"
          />

          {cardError && (
            <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
              {cardError}
            </Alert>
          )}

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">
              Amount: ${state.service?.price || "0.00"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{
                flex: 1,
                borderColor: "#35281f",
                color: "#35281f",
                "&:hover": {
                  borderColor: "#35281f",
                  backgroundColor: "rgba(53, 40, 31, 0.04)",
                },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !stripe || !elements}
              sx={{
                flex: 2,
                backgroundColor: "#35281f",
                "&:hover": {
                  backgroundColor: "#4a3c32",
                },
              }}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Processing..." : "Pay & Confirm"}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
