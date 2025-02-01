// A basic sidebar component created by GPT 4o to display the component-based booking system.
// The same prompt was used to create this component as the one used to create the Booking.js skeleton code.
import React, { useState } from 'react';
import Booking from './Booking';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className={styles.openButton} onClick={handleOpen}>Book Now</button>
      {isOpen && (
        <div className={styles.sidebar}>
          <Booking onClose={handleClose} />
        </div>
      )}
    </>
  );
}