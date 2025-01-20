import { useState } from 'react';
import { useBooking } from '../../../context/BookingContext';
import Link from 'next/link';

export default function ChooseDateTime() {
  const { bookingData, setBookingData } = useBooking();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSelectDateTime = () => {
    setBookingData({ ...bookingData, date, time });
  };

  return (
    <div>
      <h1>Choose Date & Time</h1>
      <label>Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label>Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <Link href="/booking/info">
          <button onClick={handleSelectDateTime} disabled={!date || !time}>Next</button>
      </Link>
    </div>
  );
}