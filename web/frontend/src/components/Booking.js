import React, { useState } from "react";
import styles from "../styles/Booking.module.css";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./PaymentForm";

const STEPS = {
  SERVICES: "services",
  BARBERS: "barbers",
  DATETIME: "datetime",
  INFO: "info",
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
    fullName: "",
    email: "",
    address: "",
    phone: "",
    postalCode: ""
  });

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service });
    setCurrentStep(STEPS.BARBERS);
  };

  const handleBarberSelect = (barber) => {
    setFormData({ ...formData, barber });
    setCurrentStep(STEPS.DATETIME);
  };

  const handleDateTimeSelect = (date, time) => {
    setFormData({ ...formData, date, time });
    setCurrentStep(STEPS.INFO);
  };

  const handleInfoSubmit = (info) => {
    setFormData({ ...formData, ...info });
    setCurrentStep(STEPS.PAYMENT);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.SERVICES:
        return <SelectService onServiceSelect={handleServiceSelect} />;

      case STEPS.BARBERS:
        return <ChooseBarber onBarberSelect={handleBarberSelect} />;

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
            <button onClick={() => handleDateTimeSelect(formData.date, formData.time)}>Next</button>
          </div>
        );

      case STEPS.INFO:
        return <PersonalInfo onNext={handleInfoSubmit} />;

      case STEPS.PAYMENT:
        return (
          <div>
            <PaymentForm onSuccess={handlePaymentSuccess} />
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
            <p>Full Name: {formData.fullName}</p>
            <p>Email: {formData.email}</p>
            <p>Address: {formData.address}</p>
            <p>Phone: {formData.phone}</p>
            <p>Postal Code: {formData.postalCode}</p>
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