import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PersonalInfo() {
  const router = useRouter();
  const { service, barber, date, time } = router.query;

  const [formData, setFormData] = useState({ fullName: '', email: '', address: '', phone: '', postalCode: ''});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault(); 
    // push service, barber, date, time, and first name for the confirmation page. this is a temporary solution,
    // we could probably display this info on the confirmation page from the database after the payment is done.
    const firstName = formData.fullName.split(' ')[0];
    router.push(
      `/booking/payment?service=${service}&barber=${barber}&date=${date}&time=${time}&firstName=${firstName}`
    );
  };

  return (
    <div>
      <h1>Enter Your Info</h1>

      <form onSubmit={handleNext}>
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
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postal"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
}
