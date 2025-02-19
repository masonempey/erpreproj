import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import styles from "../styles/Booking.module.css";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./paymentForm";
import Confirmation from "./Confirmation";
import ChooseDateTime from "./ChooseDateTime";

const STEPS = {
  SERVICES: 1,
  BARBERS: 2,
  DATETIME: 3,
  INFO: 4,
  PAYMENT: 5,
  CONFIRMATION: 6,
};

export default function BookingPopUp({ isOpen, onClose }) {
  const { user } = useUser();
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
    postalCode: "",
    paymentMethod: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  const setTitle = (currentStep) => {
    switch (currentStep) {
      case STEPS.SERVICES:
        return "Select a service";
      case STEPS.BARBERS:
        return "Choose a barber";
      case STEPS.DATETIME:
        return "Choose a Time";
      case STEPS.INFO:
        return "Enter your information";
      case STEPS.PAYMENT:
        return "Enter payment information";
      case STEPS.CONFIRMATION:
        return "Confirmation";
      default:
        return "";
    }
  };

  const handleServiceSelect = (service) => {
    setFormData((prev) => ({ ...prev, service }));
    setCurrentStep(STEPS.BARBERS);
  };

  const handleBarberSelect = (barber) => {
    setFormData((prev) => ({ ...prev, barber }));
    setCurrentStep(STEPS.DATETIME);
  };

  const handleDateTimeSelect = (date, time) => {
    setFormData((prev) => ({ ...prev, date, time }));
    setCurrentStep(STEPS.INFO);
  };

  const handleInfoSubmit = (info) => {
    setFormData((prev) => ({ ...prev, ...info }));
    setCurrentStep(STEPS.PAYMENT);
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod }));
    await createAppointment();
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const getBarberID = async (barberName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/barbers/${barberName}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.barberId;
    } catch (error) {
      console.error("Error fetching barber ID:", error);
    }
  };

  const createAppointment = async () => {
    try {
      const barberId = await getBarberID(formData.barber);

      const appointmentData = {
        customerName: formData.fullName,
        barberName: formData.barber,
        date: formData.date,
        time: formData.time,
        userId: user ? user.uid : null,
        barberId: barberId,
        serviceType: formData.service,
        guestDetails: user
          ? null
          : {
              name: formData.fullName,
              email: formData.email,
              phoneNumber: formData.phone,
              address: formData.address,
            },
      };

      console.log("Sending appointment data:", appointmentData);

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Appointment created:", result);
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.SERVICES:
        return (
          <SelectService
            onServiceSelect={handleServiceSelect}
            selectedService={formData.service}
          />
        );
      case STEPS.BARBERS:
        return (
          <ChooseBarber
            onBarberSelect={handleBarberSelect}
            selectedBarber={formData.barber}
          />
        );
      case STEPS.DATETIME:
        return (
          <ChooseDateTime
            onNext={handleDateTimeSelect}
            selectedDate={formData.date}
            selectedTime={formData.time}
          />
        );
      case STEPS.INFO:
        return (
          <PersonalInfo
            onNext={handleInfoSubmit}
            initialData={{
              fullName: formData.fullName,
              email: formData.email,
              address: formData.address,
              phone: formData.phone,
              postalCode: formData.postalCode,
            }}
          />
        );
      case STEPS.PAYMENT:
        return <PaymentForm onSuccess={handlePaymentSuccess} />;
      case STEPS.CONFIRMATION:
        return <Confirmation bookingData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}>
      <div className={`${styles.bookingPopUp} ${isOpen ? styles.visible : ""}`}>
        <div className={styles.bookingNav}>
          <h2>{setTitle(currentStep)}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          {currentStep !== STEPS.SERVICES && (
            <button
              className={styles.backButton}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Back
            </button>
          )}
        </div>
        <div className={styles.bookingContent}>{renderStep()}</div>
      </div>
    </div>
  );
}
