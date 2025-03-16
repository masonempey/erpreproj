import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Stack,
  Avatar,
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  Event,
  AccessTime,
  Person,
  ContentCut,
  CalendarMonth,
} from "@mui/icons-material";
import { useBooking } from "../../context/BookingContext";
import { useTheme } from "@mui/material/styles";

export default function Confirmation({ onClose }) {
  const { state, dispatch } = useBooking();
  const theme = useTheme();

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";

    try {
      // Handle dayjs objects
      const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";

    try {
      // Extract hours and minutes from time string (e.g., "14:30:00")
      const [hours, minutes] = timeString.split(":").map(Number);

      // Format time in 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch (err) {
      console.error("Time formatting error:", err);
      return timeString;
    }
  };

  const addToCalendar = () => {
    if (!state.date || !state.time) return;

    try {
      // Format date and time for calendar URL
      const eventDate = state.date.format
        ? state.date.format("YYYYMMDD")
        : new Date(state.date).toISOString().split("T")[0].replace(/-/g, "");
      const [hours, minutes] = state.time.split(":");
      const startTime = `${eventDate}T${hours}${minutes}00`;

      // Assuming appointment lasts 1 hour
      const endHour = (parseInt(hours) + 1).toString().padStart(2, "0");
      const endTime = `${eventDate}T${endHour}${minutes}00`;

      // Create calendar URL (Google Calendar format)
      const eventTitle = `Haircut with ${state.barber}`;
      const eventDetails = `Your appointment for ${state.service}`;
      const eventLocation = "The Barber Shop";

      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventTitle
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        eventDetails
      )}&location=${encodeURIComponent(eventLocation)}`;

      // Open in new tab
      window.open(calendarUrl, "_blank");
    } catch (err) {
      console.error("Calendar generation error:", err);
    }
  };

  const closeBooking = () => {
    dispatch({ type: "RESET" });
    onClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Avatar
        sx={{
          bgcolor: "#4CAF50",
          width: 80,
          height: 80,
          mb: 2,
        }}
      >
        <CheckCircle sx={{ fontSize: 45 }} />
      </Avatar>

      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          color: "#35281f",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Booking Confirmed!
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            bgcolor: "#35281f",
            color: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">Appointment Details</Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ContentCut sx={{ color: "#35281f", mr: 1 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Service
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {state.service || "N/A"}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Person sx={{ color: "#35281f", mr: 1 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Barber
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {state.barber || "N/A"}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CalendarMonth sx={{ color: "#35281f", mr: 1 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Date
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(state.date)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime sx={{ color: "#35281f", mr: 1 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Time
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {formatTime(state.time)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        An email confirmation has been sent to{" "}
        {state.personalInfo?.email || "your email address"}. You'll receive a
        reminder 24 hours before your appointment.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={closeBooking}
          sx={{
            borderColor: "#35281f",
            color: "#35281f",
            "&:hover": {
              borderColor: "#35281f",
              backgroundColor: "rgba(53, 40, 31, 0.04)",
            },
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={<Event />}
          onClick={addToCalendar}
          sx={{
            backgroundColor: "#35281f",
            "&:hover": {
              backgroundColor: "#4a3c32",
            },
          }}
        >
          Add to Calendar
        </Button>
      </Stack>
    </Box>
  );
}
