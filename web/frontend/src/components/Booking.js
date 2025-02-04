import React, { useState } from "react";
import { useRouter } from 'next/router';
import styles from "../styles/Booking.module.css";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./PaymentForm";
import Confirmation from "./Confirmation";
import ChooseDateTime from "./ChooseDateTime";

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
  const router = useRouter();

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
    console.log("Payment successful, transitioning to confirmation step");
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const renderStep = () => {
    console.log("Current step:", currentStep);
    switch (currentStep) {
      case STEPS.SERVICES:
        return <SelectService onServiceSelect={handleServiceSelect} />;

      case STEPS.BARBERS:
        return <ChooseBarber onBarberSelect={handleBarberSelect} />;

      case STEPS.DATETIME:
        return <ChooseDateTime onNext={handleDateTimeSelect} />;

      case STEPS.INFO:
        return <PersonalInfo onNext={handleInfoSubmit} />;

      case STEPS.PAYMENT:
        return (
          <div>
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </div>
        );

      case STEPS.CONFIRMATION:
        return <Confirmation />;
      default:
        return null;
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