import { useBooking } from '../../../context/BookingContext';
import Link from 'next/link';

export default function SelectService() {
  const { bookingData, setBookingData } = useBooking();
  const services = [
    'haircut',
    'haircut & hairwash',
    'haircut & beard trim',
    'kids haircut',
    'womens haircut',
    'beard trim',
    'hair perm'
  ];

  const handleSelectService = (service) => {
    setBookingData({ ...bookingData, service });
  };

  return (
    <div>
      <h1>Choose a Service</h1>
      {services.map(service => (
        <Link key={service} href="/booking/barber">
            <button onClick={() => handleSelectService(service)}>{service}</button>
        </Link>
      ))}
    </div>
  );
}