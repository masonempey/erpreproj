import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
  useTheme,
} from "@mui/material";
import { useBooking } from "../../context/BookingContext";
import { useUser } from "../../context/UserContext";
import Image from "next/image";
import LockIcon from "@mui/icons-material/Lock";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const { state, dispatch, createAppointment } = useBooking();
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
          name: state.personalInfo.fullName,
          email: state.personalInfo.email,
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
    <Box sx={{ maxWidth: 800, mx: "auto", px: isMobile ? 1 : 2 }}>
      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 0,
              borderRadius: 2,
              overflow: "hidden",
              background: "linear-gradient(145deg, #35281f 0%, #5d4c40 100%)",
              height: { xs: "160px", sm: "180px" },
              color: "white",
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
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    opacity: 0.7,
                    fontSize: isMobile ? "0.6rem" : "0.7rem",
                  }}
                >
                  Payment Details
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    letterSpacing: 2,
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                    mb: 0.5,
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
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                }}
              >
                Payment Details
              </Typography>

              {cardError && (
                <Alert severity="error" sx={{ mb: 1.5 }}>
                  {cardError}
                </Alert>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    borderRadius: 1,
                    p: { xs: 1.5, sm: 2 },
                    border: "1px solid #e0e0e0",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Card Information
                  </Typography>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: isMobile ? "14px" : "16px",
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
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  variant="outlined"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="A1A 1A1"
                  size={isMobile ? "small" : "medium"}
                  inputProps={{
                    maxLength: 7,
                    style: { textTransform: "uppercase" },
                  }}
                  helperText="Enter your Canadian postal code (e.g., A1A 1A1)"
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: { xs: 1.5, sm: 2 },
                    mb: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Booking Summary
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Service:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {state.service}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duration:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" align="right">
                        {state.serviceDuration} min
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        align="right"
                      >
                        ${state.servicePrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<LockIcon />}
              sx={{
                bgcolor: "#35281f",
                py: { xs: 1, sm: 1.5 },
                "&:hover": {
                  bgcolor: "#4a3c32",
                },
                mb: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Pay $${state.servicePrice} & Confirm`
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
                p: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                bgcolor: "rgba(0, 0, 0, 0.02)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: 1, sm: 0 },
                  mr: { sm: 2 },
                }}
              >
                <img
                  src="/images/stripe-logo.png"
                  alt="Stripe"
                  width={isMobile ? 50 : 60}
                  height={isMobile ? 21 : 25}
                  style={{ objectFit: "contain" }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Secure payments processed by Stripe. We don't store your card
                details.
              </Typography>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}
