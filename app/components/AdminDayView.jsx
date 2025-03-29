"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const AdminDayView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const barberId = "barber2"; // This would come from props or context

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      const response = await fetch(
        `/api/bookings?action=barber&barberId=${barberId}&date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  // Navigate to previous day
  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Navigate to next day
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          onClick={handlePrevDay}
          sx={{
            color: "#35281f",
            bgcolor: "rgba(53, 40, 31, 0.05)",
            "&:hover": {
              bgcolor: "rgba(53, 40, 31, 0.1)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 500, color: "#35281f" }}>
          {formatDisplayDate(selectedDate)}
        </Typography>

        <IconButton
          onClick={handleNextDay}
          sx={{
            color: "#35281f",
            bgcolor: "rgba(53, 40, 31, 0.05)",
            "&:hover": {
              bgcolor: "rgba(53, 40, 31, 0.1)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: "#35281f" }} />
        </Box>
      ) : appointments.length > 0 ? (
        <List>
          {appointments.map((appointment, index) => (
            <Card
              key={appointment.id}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "#e6853b", mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {appointment.guest_name || "Anonymous"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(appointment.date)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      py: 0.5,
                      px: 1.5,
                      bgcolor: "rgba(53, 40, 31, 0.1)",
                      borderRadius: 5,
                      color: "#35281f",
                      fontWeight: "bold",
                    }}
                  >
                    {appointment.status || "Confirmed"}
                  </Typography>
                </Box>

                {appointment.service_name && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Service:</strong> {appointment.service_name}
                  </Typography>
                )}

                {appointment.notes && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {appointment.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed rgba(53, 40, 31, 0.2)",
            borderRadius: 2,
          }}
        >
          <EventIcon
            sx={{ fontSize: 50, color: "rgba(53, 40, 31, 0.2)", mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary">
            No appointments scheduled for this day.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminDayView;
