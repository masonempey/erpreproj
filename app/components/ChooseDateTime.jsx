import React, { useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useBooking } from "../../context/BookingContext";
import { useShop } from "../../context/ShopContext";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Alert } from "@mui/material";
import styles from "../styles/DateTime.module.css";
import dayjs from "dayjs";

export default function ChooseDateTime() {
  const { state, dispatch } = useBooking();
  const { shopInfo, isWithinBusinessHours } = useShop();
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [view, setView] = useState("calendar");
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get service duration when component loads
  useEffect(() => {
    const fetchServiceDuration = async () => {
      if (!state.serviceId) return;

      try {
        console.log(`Fetching service with ID: ${state.serviceId}`);
        const response = await fetch(`/api/services/${state.serviceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch service: ${response.status}`);
        }
        const serviceData = await response.json();
        console.log("Service data:", serviceData);
        setSelectedServiceDuration(serviceData.duration_minutes || 45);
      } catch (err) {
        console.error("Error fetching service duration:", err);
      }
    };

    fetchServiceDuration();
  }, [state.serviceId]);

  // Fetch barber's existing appointments for the selected date
  useEffect(() => {
    const fetchBarberAppointments = async () => {
      if (!selectedDate || !state.barberId) return;

      try {
        setLoading(true);
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const response = await fetch(
          `/api/appointments/barbers/${state.barberId}?date=${formattedDate}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const appointments = await response.json();
        setExistingAppointments(appointments);
      } catch (err) {
        console.error("Error fetching barber appointments:", err);
        setError("Could not load barber's schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarberAppointments();
  }, [selectedDate, state.barberId]);

  const handleDateNext = () => {
    if (selectedDate) {
      setView("time");
    }
  };

  const handleTimeSelect = (slot) => {
    setTime(slot);
  };

  const handleNextStep = () => {
    if (selectedDate && time) {
      // Convert time from "8:00 AM" to 24-hour format
      let [hourMinute, period] = time.split(" ");
      let [hour, minute] = hourMinute.split(":");

      // Convert to 24-hour format
      hour = parseInt(hour);
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      // Format as HH:MM:00
      const formattedTime = `${hour.toString().padStart(2, "0")}:${minute}:00`;

      dispatch({
        type: "SELECT_DATETIME",
        payload: {
          date: selectedDate,
          time: formattedTime,
        },
      });
    }
  };

  // Check if a time slot is already booked or would overlap with existing appointments
  const isTimeSlotBooked = (timeSlot) => {
    if (existingAppointments.length === 0) return false;

    // Parse the timeSlot
    const [hourMinute, period] = timeSlot.split(" ");
    const [slotHour, slotMinute] = hourMinute.split(":");
    let hour = parseInt(slotHour);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    // Create date objects for start and end of the potential appointment
    const appointmentDate = selectedDate.format("YYYY-MM-DD");
    const slotStartTime = new Date(
      `${appointmentDate}T${hour}:${slotMinute}:00`
    );
    const slotEndTime = new Date(
      slotStartTime.getTime() + selectedServiceDuration * 60000
    );

    // Check if this slot overlaps with any existing appointment
    return existingAppointments.some((appointment) => {
      const existingStart = new Date(appointment.date);

      // Calculate end time based on the existing appointment's service duration
      // If service_duration is available, use it, otherwise use default 45 minutes
      const existingDuration = appointment.service_duration || 45;
      const existingEnd = new Date(
        existingStart.getTime() + existingDuration * 60000
      );

      // Check for overlap
      return (
        (slotStartTime < existingEnd && slotStartTime >= existingStart) ||
        (slotEndTime > existingStart && slotEndTime <= existingEnd) ||
        (slotStartTime <= existingStart && slotEndTime >= existingEnd)
      );
    });
  };

  const generateTimeSlots = () => {
    if (!selectedDate || !shopInfo) return [];

    const slots = [];
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

    // Get business hours for the selected day
    const openTime = shopInfo[`${dayName}_open`];
    const closeTime = shopInfo[`${dayName}_close`];

    // If shop is closed that day
    if (!openTime || !closeTime) return [];

    // Parse open/close times
    const [openHours, openMinutes] = openTime.split(":").map(Number);
    const [closeHours, closeMinutes] = closeTime.split(":").map(Number);

    // Calculate appointment interval based on selected service duration
    const intervalMinutes = selectedServiceDuration || 45;

    // Generate slots from opening to closing time
    let currentTime = new Date();
    currentTime.setHours(openHours, openMinutes, 0, 0);

    const endTime = new Date();
    endTime.setHours(closeHours, closeMinutes, 0, 0);

    // Subtract one service duration from end time to ensure last appointment finishes before closing
    endTime.setMinutes(endTime.getMinutes() - intervalMinutes);

    while (currentTime <= endTime) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const period = hours < 12 ? "AM" : "PM";
      const hour12 = hours % 12 || 12;

      const uniqueId = currentTime.toISOString();
      const formattedTime = `${hour12}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;

      slots.push({
        id: uniqueId,
        display: formattedTime,
      });

      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setTime(null); // Reset time selection when date changes
  };

  // check if a date should be disabled
  const isDateDisabled = (date) => {
    if (!shopInfo) return true;

    const dayOfWeek = date.day();
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

    // Check if the shop is open on this day
    return !shopInfo[`${dayName}_open`] || !shopInfo[`${dayName}_close`];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className={styles.dateTime}>
      {view === "calendar" && (
        <>
          <div className={styles.calendar}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                shouldDisableDate={isDateDisabled}
                minDate={dayjs().subtract(1, "day")}
              />
            </LocalizationProvider>
          </div>
          {selectedDate && (
            <Button onClick={handleDateNext} variant="contained" sx={{ mt: 2 }}>
              Next
            </Button>
          )}
        </>
      )}

      {view === "time" && (
        <div className={styles.timeSlots}>
          <h2>Available Times</h2>
          <div className={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={slot.display === time ? "contained" : "outlined"}
                onClick={() => handleTimeSelect(slot.display)}
                disabled={isTimeSlotBooked(slot.display)}
                className={styles.timeSlot}
                sx={{
                  m: 0.5,
                  opacity: isTimeSlotBooked(slot.display) ? 0.5 : 1,
                }}
              >
                {slot.display}
              </Button>
            ))}
          </div>
          {time && (
            <Button onClick={handleNextStep} variant="contained" sx={{ mt: 3 }}>
              Confirm
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
