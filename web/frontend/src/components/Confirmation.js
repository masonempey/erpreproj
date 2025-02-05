import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

export default function Confirmation({ bookingData }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Paper
      sx={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        maxWidth: "500px",
        margin: "2rem",
        backgroundColor: "#fafafa",
        borderRadius: "15px",
        boxShadow: "0 4px 6px rgba(53, 40, 31, 0.1)",
        border: "1px solid rgba(53, 40, 31, 0.1)",
      }}
    >
      <CheckCircleOutline sx={{ fontSize: 60, color: "#35281f" }} />
      <Typography variant="h4" sx={{ color: "#35281f" }}>
        Booking Confirmed!
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", textAlign: "center" }}>
        Thank you, {bookingData.fullName}, for booking with us!
      </Typography>
      <Divider sx={{ width: "100%" }} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Service:</Typography>
          <Typography sx={{ color: "#35281f" }}>
            {bookingData.service}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Barber:</Typography>
          <Typography sx={{ color: "#35281f" }}>
            {bookingData.barber}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Date:</Typography>
          <Typography sx={{ color: "#35281f" }}>
            {formatDate(bookingData.date)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Time:</Typography>
          <Typography sx={{ color: "#35281f" }}>{bookingData.time}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Email:</Typography>
          <Typography sx={{ color: "#35281f" }}>{bookingData.email}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ color: "#666" }}>Phone:</Typography>
          <Typography sx={{ color: "#35281f" }}>{bookingData.phone}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
