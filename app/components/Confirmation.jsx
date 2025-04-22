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
  useMediaQuery,
  useTheme,
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
import dayjs from "dayjs"; // Import dayjs

export default function Confirmation({ onClose }) {
  const { state, dispatch } = useBooking();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    try {
      // Convert string date to Date object
      const date =
        typeof dateObj === "string"
          ? new Date(dateObj)
          : dateObj.toDate
          ? dateObj.toDate()
          : new Date(dateObj);

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
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
      const [hours, minutes] = timeString.split(":").map(Number);
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
      // Handle string date format from state
      const eventDate =
        typeof state.date === "string"
          ? state.date.replace(/-/g, "") // Convert YYYY-MM-DD to YYYYMMDD
          : state.date.format
          ? state.date.format("YYYYMMDD")
          : new Date(state.date).toISOString().split("T")[0].replace(/-/g, "");

      const [hours, minutes] = state.time.split(":");
      const startTime = `${eventDate}T${hours}${minutes}00`;

      // Calculate end time based on service duration
      const serviceDuration = state.serviceDuration || 45; // Default to 45 minutes
      const endDate = dayjs(`${state.date}T${state.time}`).add(
        serviceDuration,
        "minute"
      );
      const endHour = endDate.hour().toString().padStart(2, "0");
      const endMinute = endDate.minute().toString().padStart(2, "0");
      const endTime = `${eventDate}T${endHour}${endMinute}00`;

      const eventTitle = `Haircut with ${state.barber}`;
      const eventDetails = `Your appointment for ${state.service}`;
      const eventLocation = "The Barber Shop";
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventTitle
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        eventDetails
      )}&location=${encodeURIComponent(eventLocation)}`;
      window.open(calendarUrl, "_blank");
    } catch (err) {
      console.error("Calendar generation error:", err);
    }
  };

  const closeBooking = () => {
    dispatch({ type: "RESET_BOOKING" });
    onClose && onClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: isMobile ? 1 : 1.5,
        maxWidth: 450,
        mx: "auto",
      }}
    >
      <Avatar
        sx={{
          bgcolor: "#4CAF50",
          width: isMobile ? 40 : 50,
          height: isMobile ? 40 : 50,
          mb: 1,
        }}
      >
        <CheckCircle sx={{ fontSize: isMobile ? 24 : 30 }} />
      </Avatar>

      <Typography
        variant="h6"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          color: "#35281f",
          fontWeight: 600,
          mb: 1.5,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
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
          mb: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#35281f",
            color: "white",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Appointment Details
          </Typography>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <ContentCut
                  sx={{
                    color: "#35281f",
                    mr: 1,
                    fontSize: isMobile ? 18 : 24,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                >
                  Service
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                {state.service || "N/A"}
              </Typography>
              <Divider sx={{ my: 0.5 }} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Person
                  sx={{
                    color: "#35281f",
                    mr: 1,
                    fontSize: isMobile ? 18 : 24,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                >
                  Barber
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                {state.barber || "N/A"}
              </Typography>
              <Divider sx={{ my: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <CalendarMonth
                  sx={{
                    color: "#35281f",
                    mr: 1,
                    fontSize: isMobile ? 18 : 24,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                >
                  Date
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                {formatDate(state.date)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <AccessTime
                  sx={{
                    color: "#35281f",
                    mr: 1,
                    fontSize: isMobile ? 18 : 24,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                >
                  Time
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
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
        sx={{
          mb: 2,
          fontSize: isMobile ? "0.7rem" : "0.8rem",
        }}
      >
        An email confirmation has been sent to{" "}
        {state.personalInfo?.email || "your email address"}. You'll receive a
        reminder 24 hours before your appointment.
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 2}
        width={isMobile ? "100%" : "auto"}
      >
        <Button
          variant="outlined"
          onClick={closeBooking}
          fullWidth={isMobile}
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
          fullWidth={isMobile}
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
