import { useState } from 'react';
import { useBooking } from '../../../context/BookingContext';
import Link from 'next/link';

export default function PersonalInfo() {
  const { bookingData, setBookingData } = useBooking();
  const [formData, setFormData] = useState({ fullName: '', email: '', address: '', phone: '', postalCode: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setBookingData({ ...bookingData, ...formData });
  };

  return (
    <div>
      <h1>Enter Your Info</h1>

      <form>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>

        <Link href="/booking/payment">
            <button type="button" onClick={handleSubmit}>Next</button>
        </Link>
      </form>
    </div>
  );
}