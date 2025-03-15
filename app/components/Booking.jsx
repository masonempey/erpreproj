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
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formData, setFormData] = useState({
    service: "",
    serviceId: "",
    barber: "",
    barberId: "",
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

  const handleBarberSelect = (name, id) => {
    setFormData((prev) => ({
      ...prev,
      barber: name,
      barberId: id,
    }));
    setCurrentStep(STEPS.DATETIME);
  };

  // Fix the handleServiceSelect function - it needs to accept name and id parameters
  const handleServiceSelect = (serviceName, serviceId) => {
    setFormData((prev) => ({
      ...prev,
      service: serviceName,
      serviceId: serviceId,
    }));
    setCurrentStep(STEPS.BARBERS);
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
    setPaymentProcessing(true);

    const { success, error } = await createAppointment();

    setPaymentProcessing(false);

    if (success) {
      setCurrentStep(STEPS.CONFIRMATION);
    } else {
      setPaymentError(`Failed to create appointment: ${error}`);
    }
  };

  // const updateUserCoins = async () => {
  //   if (!user) return;

  //   try {
  //     const response = await fetch(`/api/users/${user.uid}/coins`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ coins: 10 }), // Increment by 10
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update user coins");
  //     }

  //     const result = await response.json();
  //     console.log("User coins updated:", result);
  //   } catch (error) {
  //     console.error("Error updating user coins:", error);
  //   }
  // };

  const createAppointment = async () => {
    try {
      console.log("Creating appointment with data:", formData);
      const appointmentData = {
        customerName: formData.fullName,
        email: formData.email,
        barberName: formData.barber,
        date: formData.date,
        time: formData.time,
        userId: user ? user.uid : null,
        barberId: formData.barberId,
        serviceType: formData.serviceId,
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
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log("Appointment created:", result);
      // await updateUserCoins();
      return { success: true, result };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { success: false, error: error.message };
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
        return (
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            isProcessing={paymentProcessing}
            serverError={paymentError}
          />
        );
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
