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
} from "@mui/material";
import { Person, Email, Phone, Home, LocationOn } from "@mui/icons-material";
import { useBooking } from "../../context/BookingContext";
import { useUser } from "../../context/UserContext";

export default function PersonalInfo() {
  const { state, dispatch } = useBooking();
  const { personalInfo } = state;
  const { user } = useUser();
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

  const handleSubmit = () => {
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
    <Paper
      elevation={0}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        align="center"
        gutterBottom
        sx={{ color: "#35281f", mb: 3 }}
      >
        Your Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "#35281f" }} />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#35281f" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "#35281f" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home sx={{ color: "#35281f" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          sx={{ width: { xs: "100%", sm: "200px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ color: "#35281f" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            pt: 2,
            borderTop: "1px solid rgba(53, 40, 31, 0.1)",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="large"
            sx={{
              minWidth: 160,
              backgroundColor: "#35281f",
              color: "#fafafa",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#4a3c32",
              },
            }}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
