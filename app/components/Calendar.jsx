import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";

export default function Calendar({
  handleSetSelectedDate,
  selectedDate,
  appointmentDays,
}) {
  return (
    <div className={styles.dateTimeContainer}>
      <div className={styles.calendar}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={isDateBooked}
            renderDay={renderCustomDay}
          />
        </LocalizationProvider>
      </div>

      <div className={styles.timeSelector}>
        <h3>Available Times</h3>
        <div className={styles.timeSlots}>
          {availableSlots.map((slot) => (
            <Button
              variant={selectedTime === slot ? "contained" : "outlined"}
              onClick={() => selectTime(slot)}
              disabled={!isSlotAvailable(slot)}
              className={styles.timeSlot}
            >
              {formatTime(slot)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
