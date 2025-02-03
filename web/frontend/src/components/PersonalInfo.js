import React, { useState } from 'react';
import styles from '../styles/Info.module.css';

export default function PersonalInfo({ onNext }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    postalCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Enter Your Info</h1>
      <form onSubmit={handleNext} className={styles.form}>
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
            name="postalCode"
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