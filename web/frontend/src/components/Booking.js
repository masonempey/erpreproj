import React, { useState } from "react";
import styles from "../styles/Booking.module.css";
import SelectService from "./SelectService";

const STEPS = {
  SERVICES: "services",
  BARBERS: "barbers",
  DATETIME: "datetime",
  PAYMENT: "payment",
  CONFIRMATION: "confirmation",
};

export default function BookingPopUp({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(STEPS.SERVICES);
  const [formData, setFormData] = useState({
    service: "",
    barber: "",
    date: "",
    time: "",
  });

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service });
    setCurrentStep(STEPS.BARBERS);
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.SERVICES:
        return <SelectService onServiceSelect={handleServiceSelect} />;

      case STEPS.BARBERS:
        return (
          <div>
            <h3>Select Barber</h3>
            <select
              value={formData.barber}
              onChange={(e) =>
                setFormData({ ...formData, barber: e.target.value })
              }
            >
              <option value="">Select a barber</option>
              <option value="john">John</option>
              <option value="mike">Mike</option>
            </select>
            <button onClick={() => setCurrentStep(STEPS.SERVICES)}>Back</button>
            <button onClick={() => setCurrentStep(STEPS.DATETIME)}>Next</button>
          </div>
        );

      case STEPS.DATETIME:
        return (
          <div>
            <h3>Select Date & Time</h3>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
            <button onClick={() => setCurrentStep(STEPS.BARBERS)}>Back</button>
            <button onClick={() => setCurrentStep(STEPS.PAYMENT)}>Next</button>
          </div>
        );

      case STEPS.PAYMENT:
        return (
          <div>
            <h3>Payment</h3>
            {/* Add payment form */}
            <button onClick={() => setCurrentStep(STEPS.DATETIME)}>Back</button>
            <button onClick={() => setCurrentStep(STEPS.CONFIRMATION)}>
              Pay
            </button>
          </div>
        );

      case STEPS.CONFIRMATION:
        return (
          <div>
            <h3>Booking Confirmed!</h3>
            <p>Service: {formData.service}</p>
            <p>Barber: {formData.barber}</p>
            <p>Date: {formData.date}</p>
            <p>Time: {formData.time}</p>
            <button onClick={onClose}>Close</button>
          </div>
        );
    }
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}>
      <div className={`${styles.bookingPopUp} ${isOpen ? styles.visible : ""}`}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {renderStep()}
      </div>
    </div>
  );
}