"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BarberHours() {
  const [barberHours, setBarberHours] = useState(null);
  const [shopHours, setShopHours] = useState(null); // New state for shop hours
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Hardcode barberId to "barber2"
  const barberId = "barber2";

  // Fetch barber and shop hours on mount
  useEffect(() => {
    const fetchHours = async () => {
      setLoading(true);
      try {
        // Fetch barber hours
        const barberResponse = await fetch(`/api/barbers?action=hours&barberId=${barberId}`);
        if (!barberResponse.ok) throw new Error("Failed to fetch barber hours");
        const barberData = await barberResponse.json();
        const initialBarberHours = {
          Monday_Start: barberData.Monday_Start?.slice(0, 5) || "09:00",
          Monday_End: barberData.Monday_End?.slice(0, 5) || "17:00",
          Tuesday_Start: barberData.Tuesday_Start?.slice(0, 5) || "09:00",
          Tuesday_End: barberData.Tuesday_End?.slice(0, 5) || "17:00",
          Wednesday_Start: barberData.Wednesday_Start?.slice(0, 5) || "09:00",
          Wednesday_End: barberData.Wednesday_End?.slice(0, 5) || "17:00",
          Thursday_Start: barberData.Thursday_Start?.slice(0, 5) || "09:00",
          Thursday_End: barberData.Thursday_End?.slice(0, 5) || "17:00",
          Friday_Start: barberData.Friday_Start?.slice(0, 5) || "09:00",
          Friday_End: barberData.Friday_End?.slice(0, 5) || "17:00",
          Saturday_Start: barberData.Saturday_Start?.slice(0, 5) || "09:00",
          Saturday_End: barberData.Saturday_End?.slice(0, 5) || "17:00",
          Sunday_Start: barberData.Sunday_Start?.slice(0, 5) || "09:00",
          Sunday_End: barberData.Sunday_End?.slice(0, 5) || "17:00",
        };

        // Fetch shop hours
        const shopResponse = await fetch("/api/shop?action=hours");
        if (!shopResponse.ok) throw new Error("Failed to fetch shop hours");
        const shopData = await shopResponse.json();
        const initialShopHours = {
          monday_open: shopData.monday_open?.slice(0, 5) || "09:00",
          monday_close: shopData.monday_close?.slice(0, 5) || "21:00",
          tuesday_open: shopData.tuesday_open?.slice(0, 5) || "09:00",
          tuesday_close: shopData.tuesday_close?.slice(0, 5) || "17:00",
          wednesday_open: shopData.wednesday_open?.slice(0, 5) || "09:00",
          wednesday_close: shopData.wednesday_close?.slice(0, 5) || "21:00",
          thursday_open: shopData.thursday_open?.slice(0, 5) || "09:00",
          thursday_close: shopData.thursday_close?.slice(0, 5) || "21:00",
          friday_open: shopData.friday_open?.slice(0, 5) || "09:00",
          friday_close: shopData.friday_close?.slice(0, 5) || "21:00",
          saturday_open: shopData.saturday_open?.slice(0, 5) || "09:00",
          saturday_close: shopData.saturday_close?.slice(0, 5) || "21:00",
          sunday_open: shopData.sunday_open?.slice(0, 5) || "09:00",
          sunday_close: shopData.sunday_close?.slice(0, 5) || "21:00",
        };

        setBarberHours(initialBarberHours);
        setShopHours(initialShopHours);
        setFormData(initialBarberHours);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching hours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHours();
  }, []);

  // Validate barber hours against shop hours
  const isWithinShopHours = (day, type, value) => {
    if (!shopHours) return true; // Skip validation if shop hours aren't loaded
    const dayLower = day.toLowerCase();
    const shopOpen = shopHours[`${dayLower}_open`];
    const shopClose = shopHours[`${dayLower}_close`];

    if (type === "Start") {
      return value >= shopOpen && value <= shopClose;
    } else {
      // For End time, ensure it's after shop open and not later than shop close
      return value >= shopOpen && value <= shopClose;
    }
  };

  // Handle input changes with validation
  const handleInputChange = (day, type, value) => {
    if (isWithinShopHours(day, type, value)) {
      setError(null); // Clear any previous error
      setFormData((prev) => ({
        ...prev,
        [`${day}_${type}`]: value,
      }));
    } else {
      setError(
        `${day} ${type} time must be within shop hours (${
          shopHours[`${day.toLowerCase()}_open`]
        } - ${shopHours[`${day.toLowerCase()}_close`]})`
      );
    }
  };

  // Validate all hours before saving
  const validateAllHours = () => {
    for (const day of daysOfWeek) {
      const start = formData[`${day}_Start`];
      const end = formData[`${day}_End`];
      if (!isWithinShopHours(day, "Start", start)) {
        return `${day} start time is outside shop hours`;
      }
      if (!isWithinShopHours(day, "End", end)) {
        return `${day} end time is outside shop hours`;
      }
      // Ensure end time is after start time
      if (start >= end) {
        return `${day} end time must be after start time`;
      }
    }
    return null;
  };

  // Save updated hours
  const handleSave = async () => {
    // Validate all hours
    const validationError = validateAllHours();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    // Format for API (add seconds back)
    const payload = {
      action: "updateHours",
      barberId,
    };
    Object.keys(formData).forEach((key) => {
      payload[key] = `${formData[key]}:00`; // "09:00" -> "09:00:00"
    });

    try {
      const response = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update barber hours");
      }

      const result = await response.json();
      setBarberHours(formData); // Update displayed hours
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Clear success after 3s
    } catch (err) {
      setError(err.message);
      console.error("Error updating barber hours:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData(barberHours); // Reset on cancel
      setError(null); // Clear any errors
    }
  };

  if (loading && !barberHours) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  // Fallback data for barber hours
  const hours = barberHours || {
    Monday_Start: "09:00",
    Monday_End: "17:00",
    Tuesday_Start: "09:00",
    Tuesday_End: "17:00",
    Wednesday_Start: "09:00",
    Wednesday_End: "17:00",
    Thursday_Start: "09:00",
    Thursday_End: "17:00",
    Friday_Start: "09:00",
    Friday_End: "17:00",
    Saturday_Start: "09:00",
    Saturday_End: "17:00",
    Sunday_Start: "09:00",
    Sunday_End: "17:00",
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Barber hours updated successfully!
        </Alert>
      )}

      {isEditing ? (
        <Grid container spacing={2}>
          {daysOfWeek.map((day) => (
            <Grid item xs={12} key={day}>
              <Typography
                variant="body1"
                sx={{ textTransform: "capitalize", mb: 1 }}
              >
                <strong>{day}:</strong> (Shop hours:{" "}
                {shopHours
                  ? `${shopHours[`${day.toLowerCase()}_open`]} - ${
                      shopHours[`${day.toLowerCase()}_close`]
                    }`
                  : "Loading..."}
                )
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Start"
                  type="time"
                  name={`${day}_Start`}
                  value={formData[`${day}_Start`]}
                  onChange={(e) =>
                    handleInputChange(day, "Start", e.target.value)
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5-minute intervals
                  sx={{ flex: 1 }}
                  disabled={!shopHours} // Disable until shop hours are loaded
                />
                <TextField
                  label="End"
                  type="time"
                  name={`${day}_End`}
                  value={formData[`${day}_End`]}
                  onChange={(e) => handleInputChange(day, "End", e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  sx={{ flex: 1 }}
                  disabled={!shopHours}
                />
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={toggleEdit}
                startIcon={<CancelIcon />}
                sx={{
                  borderColor: "#35281f",
                  color: "#35281f",
                  "&:hover": {
                    borderColor: "#4a3c32",
                    backgroundColor: "rgba(53, 40, 31, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !shopHours}
                startIcon={
                  saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  backgroundColor: "#35281f",
                  "&:hover": {
                    backgroundColor: "#4a3c32",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={2}>
            {daysOfWeek.map((day) => (
              <Grid item xs={12} md={6} key={day}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{day}:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hours[`${day}_Start`]} - {hours[`${day}_End`]}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={toggleEdit}
            startIcon={<EditIcon />}
            sx={{
              mt: 3,
              backgroundColor: "#35281f",
              "&:hover": {
                backgroundColor: "#4a3c32",
              },
            }}
          >
            Edit Hours
          </Button>
        </Box>
      )}
    </Box>
  );
}