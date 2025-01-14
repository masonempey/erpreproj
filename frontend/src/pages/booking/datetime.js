import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ChooseDateTime() {
  const router = useRouter();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const { barber, service } = router.query;

  const handleNext = () => {
    if (date && time) {
      router.push(`/booking/info?service=${service}&barber=${barber}&date=${date}&time=${time}`);
    }
  };

  return (
    <div>
      <h1>Choose Date & Time</h1>
      <label>Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label>Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <button onClick={handleNext} disabled={!date || !time}>Next</button>
    </div>
  );
}
