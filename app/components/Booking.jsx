"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "../styles/Booking.module.css";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./paymentForm";
import Confirmation from "./Confirmation";
import ChooseDateTime from "./ChooseDateTime";

// Defining step constants for the booking system (in order)
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
  const [isReload, setIsReload] = useState(false);
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

  // Update the form data whenever user info changes
  // Tracks user changes via [user] in the dependency array
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Change the title of the booking popup based on the current step
  const setTitle = (currentStep) => {
    switch (currentStep) {
      case STEPS.SERVICES:
        return "Select a Service";
      case STEPS.BARBERS:
        return "Choose a Barber";
      case STEPS.DATETIME:
        return "Choose a Date and Time";
      case STEPS.INFO:
        return "Enter Your Information";
      case STEPS.PAYMENT:
        return "Enter Payment Information";
      case STEPS.CONFIRMATION:
        return "Confirmation";
      default:
        return "";
    }
  };

  // When the user selects a service, update the form data and switch the step to barbers.
  const handleServiceSelect = (service) => {
    setFormData((prev) => ({ ...prev, service }));
    setCurrentStep(STEPS.BARBERS);
  };

  // When the user selects a barber, update the form data and switch the step to datetime.
  const handleBarberSelect = (barber) => {
    setFormData((prev) => ({ ...prev, barber }));
    setCurrentStep(STEPS.DATETIME);
  };

  // When the user selects a date and time, update the form data and switch the step to info.
  const handleDateTimeSelect = (date, time) => {
    setFormData((prev) => ({ ...prev, date, time }));
    setCurrentStep(STEPS.INFO);
  };

  // When the user submits their personal info, update the form data and switch the step to payment.
  const handleInfoSubmit = (info) => {
    setFormData((prev) => ({ ...prev, ...info }));
    setCurrentStep(STEPS.PAYMENT);
  };

  // When the user successfully completes payment, update the form data and create an appointment.
  const handlePaymentSuccess = async (paymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod }));
    await createAppointment();
    setCurrentStep(STEPS.CONFIRMATION);
  };

  // Fetch the barber ID based on the barber name
  const getBarberID = async (barberName) => {
    try {
      const response = await fetch(`/api/barbers/${barberName}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.barberId;
    } catch (error) {
      console.error("Error fetching barber ID:", error);
    }
  };

  const updateUserCoins = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.uid}/coins`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins: 10 }), // Increment by 10
      });

      if (!response.ok) {
        throw new Error("Failed to update user coins");
      }

      const result = await response.json();
      console.log("User coins updated:", result);
    } catch (error) {
      console.error("Error updating user coins:", error);
    }
  };

  const createAppointment = async () => {
    try {
      const barberId = await getBarberID(formData.barber);

      const appointmentData = {
        customerName: formData.fullName,
        email: formData.email,
        barberName: formData.barber,
        date: formData.date,
        time: formData.time,
        userId: user ? user.uid : null,
        barberId: barberId,
        serviceType: formData.service,
        // If user is logged in, use their details, otherwise use the details entered in the form
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

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the appointment data as the request body
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Appointment created:", result);
      await updateUserCoins();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const renderStep = () => {
    // Check what the current step is, then render it, pass a function to handle the user's selection and current form data.
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
          <button
            className={styles.closeButton}
            onClick={() => {
              if (currentStep === STEPS.CONFIRMATION) {
                window.location.reload();
              }
              onClose();
            }}
          >
            ×
          </button>
          {currentStep !== STEPS.SERVICES &&
            currentStep !== STEPS.CONFIRMATION && (
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
