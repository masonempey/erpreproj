import { useBooking } from '../../../context/BookingContext';

export default function Confirmation() {
  const { bookingData } = useBooking();

  return (
    <div>
      <h1>Booking Confirmation</h1>
      <p>Hi {bookingData.fullName},</p>
      <p>Thank you for booking with Erpre Barber & Shop!</p>
      <p>Your appointment is scheduled as follows:</p>
      <ul>
        <li><strong>Service:</strong> {bookingData.service}</li>
        <li><strong>Barber:</strong> {bookingData.barber}</li>
        <li><strong>Date:</strong> {bookingData.date}</li>
        <li><strong>Time:</strong> {bookingData.time}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    </div>
  );
}