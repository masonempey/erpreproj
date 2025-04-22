import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Grid,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Person, Email, Phone, Home, LocationOn } from "@mui/icons-material";
import { useBooking } from "../../context/BookingContext";
import { useUser } from "../../context/UserContext";

export default function PersonalInfo() {
  const { state, dispatch } = useBooking();
  const { personalInfo } = state;
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [formData, setFormData] = useState({
    fullName: personalInfo.fullName || "",
    email: personalInfo.email || "",
    phone: personalInfo.phone || "",
    address: personalInfo.address || "",
    postalCode: personalInfo.postalCode || "",
  });
  const [error, setError] = useState("");

  // Add this effect to update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: user.name || prevState.fullName,
        email: user.email || prevState.email,
        phone: user.phoneNumber || prevState.phone,
        address: user.address || prevState.address,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid phone number");
      return;
    }

    // Submit data to context
    dispatch({
      type: "UPDATE_PERSONAL_INFO",
      payload: formData,
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        px: isMobile ? 1 : 2,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 3,
          textAlign: "center",
          fontSize: isMobile ? "1.1rem" : "1.25rem",
        }}
      >
        Your Information
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            fontSize: isMobile ? "0.75rem" : "0.85rem",
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#35281f",
                py: isMobile ? 1 : 1.5,
                "&:hover": {
                  bgcolor: "#4a3c32",
                },
              }}
            >
              {state.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
