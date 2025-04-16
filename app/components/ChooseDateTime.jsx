import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Container,
} from "@mui/material";
import TimeSelector from "./TimeSlot";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ChooseDateTime() {
  const { state, dispatch } = useBooking();
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [view, setView] = useState("calendar");
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get today's date at midnight for proper comparison
  const today = dayjs().startOf("day");

  useEffect(() => {
    // If selectedDate is set and valid, fetch appointments
    if (selectedDate && state.barberId) {
      fetchAppointmentsForDate(selectedDate);
    }
  }, [selectedDate, state.barberId]);

  const fetchAppointmentsForDate = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.format("YYYY-MM-DD");

      const response = await fetch(
        `/api/bookings?action=barber&barberId=${state.barberId}&date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }

      const appointments = await response.json();
      setExistingAppointments(appointments || []); // Ensure it's always at least an empty array
    } catch (err) {
      console.error("Error fetching barber appointments:", err);
      setError("Could not load barber's schedule. Please try again.");
      setExistingAppointments([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setTime(null); // Reset time when date changes
    setView("time");
  };

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleContinue = () => {
    if (!selectedDate || !time) return;

    dispatch({
      type: "SELECT_DATETIME",
      payload: {
        date: selectedDate.format("YYYY-MM-DD"),
        time: time,
      },
    });
  };

  const handleBack = () => {
    if (view === "time") {
      setView("calendar");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <CalendarMonthIcon sx={{ mr: 1, color: "#35281f" }} />
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 600,
              color: "#35281f",
              textAlign: "center",
              width: "100%",
            }}
          >
            {view === "calendar" ? "Select a Date" : "Select a Time"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {view === "calendar" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              "& .MuiDateCalendar-root": {
                width: "100%",
                maxWidth: "400px",
              },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                loading={loading}
                disablePast={true}
                minDate={today}
                sx={{
                  width: "100%",
                  "& .MuiPickersDay-root": {
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "#35281f",
                      color: "#fff",
                    },
                  },
                  "& .MuiPickersDay-root.Mui-selected:hover": {
                    backgroundColor: "#35281f",
                    color: "#fff",
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#35281f",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                mb: 3,
                borderColor: "#35281f",
                color: "#35281f",
                "&:hover": {
                  borderColor: "#5d4a3e",
                  backgroundColor: "rgba(53, 40, 31, 0.04)",
                },
              }}
            >
              Back to Calendar
            </Button>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress sx={{ color: "#35281f" }} />
              </Box>
            ) : (
              <>
                <TimeSelector
                  selectedDate={selectedDate}
                  existingAppointments={existingAppointments}
                  onTimeSelect={handleTimeSelect}
                  selectedTime={time}
                  serviceDuration={state.serviceDuration}
                />

                <Box
                  sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    disabled={!time}
                    onClick={handleContinue}
                    sx={{
                      bgcolor: "#35281f",
                      "&:hover": { bgcolor: "#5d4a3e" },
                      py: 1.5,
                      px: 3,
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
