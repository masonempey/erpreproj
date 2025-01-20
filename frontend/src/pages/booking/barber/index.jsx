import { useBooking } from '../../../context/BookingContext';
import Link from 'next/link';

export default function ChooseBarber() {
  const { bookingData, setBookingData } = useBooking();
  const barbers = ['Rogin', 'Carl', 'Guio', 'George', 'Troy'];

  const handleSelectBarber = (barber) => {
    setBookingData({ ...bookingData, barber });
  };

  return (
    <div>
      <h1>Choose a Barber</h1>
      <p>Selected Service: {bookingData.service}</p>
      {barbers.map(barber => (
        <Link key={barber} href="/booking/datetime">
            <button onClick={() => handleSelectBarber(barber)}>{barber}</button>
        </Link>
      ))}
    </div>
  );
}