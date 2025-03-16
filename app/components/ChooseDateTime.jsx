import React, { useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useBooking } from "../../context/BookingContext";
import Button from "@mui/material/Button";
import styles from "../styles/DateTime.module.css";

export default function ChooseDateTime() {
  const { state, dispatch } = useBooking();
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [view, setView] = useState("calendar");

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

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0);

    for (let i = 0; i < 18; i++) {
      const slotTime = new Date(startTime.getTime() + i * 30 * 60000);
      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
      const formattedTime = `${hours % 12 || 12}:${
        minutes === 0 ? "00" : minutes
      } ${hours < 12 ? "AM" : "PM"}`;
      slots.push(formattedTime);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className={styles.dateTime}>
      {view === "calendar" && (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              className={styles.calendar}
              sx={{
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#35281f",
                  "&:hover": {
                    backgroundColor: "#35281f",
                  },
                },
                "& .MuiPickersDay-root.Mui-selected:focus": {
                  backgroundColor: "#35281f",
                },
                "& .MuiPickersDay-today": {
                  borderColor: "#35281f",
                },
              }}
            />
          </LocalizationProvider>
          {selectedDate && (
            <Button
              onClick={handleDateNext}
              variant="contained"
              sx={{
                marginTop: "2rem",
                backgroundColor: "#35281f",
                color: "#fafafa",
                "&:hover": {
                  backgroundColor: "#fafafa",
                  color: "#35281f",
                },
              }}
            >
              Next
            </Button>
          )}
        </>
      )}

      {view === "time" && (
        <div className={styles.timeSlots}>
          <h2>Available Slots</h2>
          <div className={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={slot === time ? "contained" : "outlined"}
                onClick={() => handleTimeSelect(slot)}
                className={styles.timeSlot}
              >
                {slot}
              </Button>
            ))}
          </div>
          {time && (
            <Button
              onClick={() => handleNextStep()}
              variant="contained"
              sx={{
                marginTop: "2rem",
                backgroundColor: "#35281f",
                color: "#fafafa",
                "&:hover": {
                  backgroundColor: "#fafafa",
                  color: "#35281f",
                },
              }}
            >
              Confirm
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
