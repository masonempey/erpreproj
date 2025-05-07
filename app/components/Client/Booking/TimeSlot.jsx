import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import { useShop } from "../../../../context/ShopContext";
import dayjs from "dayjs";

export default function TimeSelector({
  selectedDate,
  existingAppointments,
  onTimeSelect,
  selectedTime,
  serviceDuration = 45, // Duration in minutes
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState(0); // 0: Morning, 1: Afternoon, 2: Evening
  const [groupedTimeSlots, setGroupedTimeSlots] = useState({});
  const { shopInfo } = useShop(); // Get shop hours from context

  // Group time slots by hour and time of day
  useEffect(() => {
    if (availableTimeSlots.length === 0) return;

    const morning = {};
    const afternoon = {};
    const evening = {};

    availableTimeSlots.forEach((time) => {
      const [hourStr] = time.split(":");
      const hour = parseInt(hourStr);

      // Group by hour
      if (hour < 12) {
        if (!morning[hour]) morning[hour] = [];
        morning[hour].push(time);
      } else if (hour < 17) {
        if (!afternoon[hour]) afternoon[hour] = [];
        afternoon[hour].push(time);
      } else {
        if (!evening[hour]) evening[hour] = [];
        evening[hour].push(time);
      }
    });

    setGroupedTimeSlots({ morning, afternoon, evening });
  }, [availableTimeSlots]);

  useEffect(() => {
    if (!selectedDate) return;

    // Make sure existingAppointments is an array
    const appointments = Array.isArray(existingAppointments)
      ? existingAppointments
      : [];

    // Get the day of week (0=Sunday, 1=Monday, etc.)
    const dayOfWeek = selectedDate.day();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayOfWeek];

    // Get shop hours for this day from the context
    const openTimeStr = shopInfo?.[`${dayName}_open`] || "09:00";
    const closeTimeStr = shopInfo?.[`${dayName}_close`] || "19:00";

    // Parse shop hours
    const [openHour, openMinute] = openTimeStr.split(":").map(Number);
    const [closeHour, closeMinute] = closeTimeStr.split(":").map(Number);

    // Check if we're booking for today
    const isToday =
      selectedDate.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

    // If booking for today, start time should be at least current time + buffer
    let startHour = openHour;
    let startMinute = openMinute;

    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Add 30 minutes buffer for immediate bookings
      let bufferMinute = currentMinute + 30;
      let bufferHour = currentHour;

      if (bufferMinute >= 60) {
        bufferHour += 1;
        bufferMinute -= 60;
      }

      // If current time + buffer is after opening time, use it as start
      if (
        bufferHour > startHour ||
        (bufferHour === startHour && bufferMinute > startMinute)
      ) {
        startHour = bufferHour;
        startMinute = bufferMinute;

        // Round up to the next 15-minute slot
        if (startMinute % 15 !== 0) {
          startMinute = Math.ceil(startMinute / 15) * 15;
          if (startMinute === 60) {
            startHour += 1;
            startMinute = 0;
          }
        }
      }
    }

    // Calculate the latest start time (closing time minus service duration)
    const serviceHours = Math.floor(serviceDuration / 60);
    const serviceMinutes = serviceDuration % 60;

    // Calculate end hour and minute by subtracting service duration
    let endHour = closeHour;
    let endMinute = closeMinute - serviceMinutes;

    if (endMinute < 0) {
      endHour--;
      endMinute += 60;
    }
    endHour -= serviceHours;

    // If the service is too long to fit before closing or if it's after hours, don't offer appointments
    if (
      endHour < startHour ||
      (endHour === startHour && endMinute < startMinute)
    ) {
      setAvailableTimeSlots([]);
      return;
    }

    const slotDuration = 15; // Time slot intervals in minutes
    const slots = [];

    // Generate available slots
    for (let hour = startHour; hour <= endHour; hour++) {
      // Determine starting minute for this hour
      const firstMinute = hour === startHour ? startMinute : 0;
      // Ensure we start on a 15-minute boundary
      const adjustedFirstMinute =
        Math.ceil(firstMinute / slotDuration) * slotDuration;

      for (
        let minute = adjustedFirstMinute;
        minute < 60;
        minute += slotDuration
      ) {
        // Skip slots after the latest start time
        if (hour === endHour && minute > endMinute) continue;

        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }

    // Mark slots as unavailable if they conflict with existing appointments
    const unavailableSlots = new Set();

    appointments.forEach((appointment) => {
      // Extract date and time from the appointment
      const apptDate = new Date(appointment.date);
      const apptHour = apptDate.getHours();
      const apptMinute = apptDate.getMinutes();

      // Calculate start and end minutes of the appointment
      const apptStartMinutes = apptHour * 60 + apptMinute;
      // Use the actual service duration from the appointment if available
      const appointmentDuration = appointment.service_duration || 45;
      const apptEndMinutes = apptStartMinutes + appointmentDuration;

      // Mark conflicting slots as unavailable
      slots.forEach((slot) => {
        const [slotHour, slotMinute] = slot.split(":").map(Number);
        const slotStartMinutes = slotHour * 60 + slotMinute;
        const slotEndMinutes = slotStartMinutes + serviceDuration;

        // Check for any overlap between this slot and the appointment
        if (
          // Case 1: Slot starts during an existing appointment
          (slotStartMinutes >= apptStartMinutes &&
            slotStartMinutes < apptEndMinutes) ||
          // Case 2: Slot ends during an existing appointment
          (slotEndMinutes > apptStartMinutes &&
            slotEndMinutes <= apptEndMinutes) ||
          // Case 3: Slot completely contains an existing appointment
          (slotStartMinutes <= apptStartMinutes &&
            slotEndMinutes >= apptEndMinutes)
        ) {
          unavailableSlots.add(slot);
        }
      });
    });

    // Filter out unavailable slots
    const availableSlots = slots.filter((slot) => !unavailableSlots.has(slot));

    setAvailableTimeSlots(availableSlots);
  }, [selectedDate, existingAppointments, serviceDuration, shopInfo]);

  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Calculate end time based on start time and service duration
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    let endMinutes = minutes + serviceDuration;
    let endHours = hours + Math.floor(endMinutes / 60);
    endMinutes = endMinutes % 60;

    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTimeOfDay(newValue);
  };

  // Get current time slots based on selected time of day
  const getCurrentTimeSlots = () => {
    if (timeOfDay === 0) return groupedTimeSlots.morning || {};
    if (timeOfDay === 1) return groupedTimeSlots.afternoon || {};
    return groupedTimeSlots.evening || {};
  };

  const currentTimeSlots = getCurrentTimeSlots();
  const hasTimeSlots = Object.keys(currentTimeSlots).length > 0;

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 2,
          fontSize: isMobile ? "1rem" : "1.25rem",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Available times for {selectedDate?.format("MMMM D, YYYY")}
      </Typography>

      {serviceDuration > 45 && (
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: isMobile ? "0.75rem" : "0.85rem",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          This service requires {serviceDuration} minutes (
          {Math.floor(serviceDuration / 60) > 0
            ? `${Math.floor(serviceDuration / 60)} hour${
                Math.floor(serviceDuration / 60) > 1 ? "s" : ""
              }`
            : ""}
          {serviceDuration % 60 > 0 ? ` ${serviceDuration % 60} minutes` : ""})
        </Typography>
      )}

      {/* Time of day tabs */}
      <Paper sx={{ mb: 3, borderRadius: "8px", overflow: "hidden" }}>
        <Tabs
          value={timeOfDay}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#35281f",
            },
            "& .Mui-selected": {
              color: "#35281f",
              fontWeight: "bold",
            },
            "& .MuiTab-root": {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              minHeight: isMobile ? "48px" : "56px",
            },
          }}
        >
          <Tab
            icon={<LightModeIcon />}
            label="Morning"
            disabled={!Object.keys(groupedTimeSlots.morning || {}).length}
          />
          <Tab
            icon={<WbTwilightIcon />}
            label="Afternoon"
            disabled={!Object.keys(groupedTimeSlots.afternoon || {}).length}
          />
          <Tab
            icon={<NightsStayIcon />}
            label="Evening"
            disabled={!Object.keys(groupedTimeSlots.evening || {}).length}
          />
        </Tabs>
      </Paper>

      {availableTimeSlots.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "rgba(53, 40, 31, 0.03)",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {serviceDuration > 120
              ? `This service requires ${serviceDuration} minutes and may not fit within today's operating hours.`
              : "No available time slots for this date. Please select another day."}
          </Typography>
        </Paper>
      ) : !hasTimeSlots ? (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "rgba(53, 40, 31, 0.03)",
            borderRadius: "8px",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No{" "}
            {timeOfDay === 0
              ? "morning"
              : timeOfDay === 1
              ? "afternoon"
              : "evening"}{" "}
            appointments available. Try another time of day.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            maxHeight: "350px",
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#35281f",
              borderRadius: "10px",
            },
          }}
        >
          {Object.entries(currentTimeSlots).map(([hour, times]) => (
            <Box key={hour} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTimeIcon
                  sx={{ mr: 1, color: "#35281f", fontSize: 20 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {formatTime(`${hour}:00`).split(" ")[0]}{" "}
                  {parseInt(hour) >= 12 ? "PM" : "AM"}
                </Typography>
              </Box>

              <Grid container spacing={1.5}>
                {times.map((time) => (
                  <Grid item xs={4} sm={3} md={2} key={time}>
                    <Tooltip
                      title={`${formatTime(time)} - ${formatTime(
                        calculateEndTime(time)
                      )}`}
                    >
                      <Chip
                        label={formatTime(time).split(" ")[0]} // Just show time without AM/PM
                        onClick={() => onTimeSelect(time)}
                        sx={{
                          width: "100%",
                          height: "auto",
                          p: { xs: 0.5, sm: 0.75 },
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          fontWeight: selectedTime === time ? "bold" : "normal",
                          backgroundColor:
                            selectedTime === time ? "#35281f" : "white",
                          color: selectedTime === time ? "white" : "inherit",
                          border: "1px solid #e0e0e0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              selectedTime === time
                                ? "#35281f"
                                : "rgba(53, 40, 31, 0.08)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
                          },
                        }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>

              {Object.keys(currentTimeSlots).indexOf(hour) <
                Object.keys(currentTimeSlots).length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
