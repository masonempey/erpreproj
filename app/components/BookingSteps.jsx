// BookingSteps.jsx
import React from "react";
import { useBooking } from "../../context/BookingContext";
import styles from "../styles/BookingSteps.module.css";

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Barber" },
  { id: 3, name: "Date & Time" },
  { id: 4, name: "Details" },
  { id: 5, name: "Payment" },
  { id: 6, name: "Confirmation" },
];

export default function BookingSteps() {
  const { state } = useBooking();

  return (
    <div className={styles.stepsContainer}>
      {steps.map((step) => (
        <div
          key={step.id}
          className={`${styles.step} ${
            state.step >= step.id ? styles.active : ""
          }`}
        >
          <div className={styles.stepNumber}>{step.id}</div>
          <div className={styles.stepName}>{step.name}</div>
        </div>
      ))}
    </div>
  );
}
