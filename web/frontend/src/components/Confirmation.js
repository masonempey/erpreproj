import React from 'react';
import styles from '../styles/Confirmation.module.css';

export default function Confirmation() {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Booking Confirmed!</h1>
      <p className={styles.thankYou}>Thank you, , for booking with us. See you soon!</p>

      <h2 className={styles.detailsTitle}>Booking Details:</h2>
      <p className={styles.detail}><strong>Service:</strong> </p>
      <p className={styles.detail}><strong>Barber:</strong> </p>
      <p className={styles.detail}><strong>Date:</strong> </p>
      <p className={styles.detail}><strong>Time:</strong> </p>
    </div>
  );
}