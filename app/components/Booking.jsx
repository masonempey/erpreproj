// Booking.jsx
"use client";

import React from "react";
import { BookingProvider } from "../../context/BookingContext";
import BookingSteps from "./BookingSteps";
import BookingForm from "./BookingForm";
import styles from "../styles/Booking.module.css";

export default function BookingPopUp({ isOpen, onClose }) {
  console.log("BookingPopUp rendered, isOpen:", isOpen);
  if (!isOpen) return null;

  return (
    <BookingProvider>
      <div className={`${styles.overlay} ${styles.visible}`}>
        <div className={styles.bookingContainer}>
          <header>
            <h2>Book Your Appointment</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
          </header>
          <BookingSteps />
          <BookingForm onClose={onClose} />
        </div>
      </div>
    </BookingProvider>
  );
}
