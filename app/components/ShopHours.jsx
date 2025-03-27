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
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function ShopHours() {
  const [shopHours, setShopHours] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch shop hours on mount
  useEffect(() => {
    const fetchShopHours = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shop hours");
        const data = await response.json();
        const initialHours = {
          monday_open: data.monday_open?.slice(0, 5) || "09:00",
          monday_close: data.monday_close?.slice(0, 5) || "21:00",
          tuesday_open: data.tuesday_open?.slice(0, 5) || "09:00",
          tuesday_close: data.tuesday_close?.slice(0, 5) || "17:00",
          wednesday_open: data.wednesday_open?.slice(0, 5) || "09:00",
          wednesday_close: data.wednesday_close?.slice(0, 5) || "21:00",
          thursday_open: data.thursday_open?.slice(0, 5) || "09:00",
          thursday_close: data.thursday_close?.slice(0, 5) || "21:00",
          friday_open: data.friday_open?.slice(0, 5) || "09:00",
          friday_close: data.friday_close?.slice(0, 5) || "21:00",
          saturday_open: data.saturday_open?.slice(0, 5) || "09:00",
          saturday_close: data.saturday_close?.slice(0, 5) || "21:00",
          sunday_open: data.sunday_open?.slice(0, 5) || "09:00",
          sunday_close: data.sunday_close?.slice(0, 5) || "21:00",
        };
        setShopHours(initialHours);
        setFormData(initialHours);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching shop hours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopHours();
  }, []);

  // Handle input changes
  const handleInputChange = (day, type, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${day}_${type}`]: value,
    }));
  };

  // Save updated hours
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Format for API (add seconds back)
    const payload = {};
    Object.keys(formData).forEach((key) => {
      payload[key] = `${formData[key]}:00`; // "09:00" -> "09:00:00"
    });

    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update shop hours");
      }

      const result = await response.json();
      setShopHours(payload); // Update displayed hours
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Clear success after 3s
    } catch (err) {
      setError(err.message);
      console.error("Error updating shop hours:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) setFormData(shopHours); // Reset on cancel
  };

  if (loading && !shopHours) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  // Fallback data
  const hours = shopHours || {
    monday_open: "09:00",
    monday_close: "21:00",
    tuesday_open: "09:00",
    tuesday_close: "17:00",
    wednesday_open: "09:00",
    wednesday_close: "21:00",
    thursday_open: "09:00",
    thursday_close: "21:00",
    friday_open: "09:00",
    friday_close: "21:00",
    saturday_open: "09:00",
    saturday_close: "21:00",
    sunday_open: "09:00",
    sunday_close: "21:00",
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
          Shop hours updated successfully!
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
                <strong>{day}:</strong>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Open"
                  type="time"
                  name={`${day}_open`}
                  value={formData[`${day}_open`]}
                  onChange={(e) => handleInputChange(day, "open", e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5-minute intervals
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Close"
                  type="time"
                  name={`${day}_close`}
                  value={formData[`${day}_close`]}
                  onChange={(e) => handleInputChange(day, "close", e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  sx={{ flex: 1 }}
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
                disabled={saving}
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
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hours[`${day}_open`]} - {hours[`${day}_close`]}
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