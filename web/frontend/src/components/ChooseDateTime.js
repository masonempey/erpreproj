import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import styles from '../styles/DateTime.module.css';

function ChooseDateTime({ onNext }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');

  const handleTimeSelect = (slot) => {
    setTime(slot);
    if (selectedDate && slot) {
      onNext(selectedDate, slot);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // Start at 8:00 AM

    for (let i = 0; i < 18; i++) { // 18 slots for 30-minute intervals up to 5:00 PM
      const slotTime = new Date(startTime.getTime() + i * 30 * 60000); // 30-minute intervals
      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
      const formattedTime = `${hours % 12 || 12}:${minutes === 0 ? '00' : minutes} ${hours < 12 ? 'AM' : 'PM'}`;
      slots.push(formattedTime);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className={styles.dateTime}>
      {!selectedDate && (
        <>
          <h1 className={styles.title}>Choose Date & Time</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              className={styles.calendar}
            />
          </LocalizationProvider>
        </>
      )}

      {selectedDate && (
        <div className={styles.timeSlots}>
          <h2>Available Time Slots</h2>
          <div className={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={slot === time ? 'contained' : 'outlined'}
                onClick={() => handleTimeSelect(slot)}
                className={styles.timeSlot}
                style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseDateTime;