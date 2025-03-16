// BookingForm.jsx
import React from "react";
import { useBooking } from "../../context/BookingContext";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import ChooseDateTime from "./ChooseDateTime";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./PaymentForm";
import Confirmation from "./Confirmation";
import styles from "../styles/Booking.module.css";

export default function BookingForm({ onClose }) {
  const { state, dispatch } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <SelectService />;
      case 2:
        return <ChooseBarber />;
      case 3:
        return <ChooseDateTime />;
      case 4:
        return <PersonalInfo />;
      case 5:
        return <PaymentForm />;
      case 6:
        return <Confirmation onClose={onClose} />;
      default:
        return <SelectService />;
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      dispatch({ type: "GO_BACK" });
    }
  };

  return (
    <div className={styles.formContainer}>
      {renderStep()}

      {state.step > 1 && state.step < 6 && (
        <div className={styles.navigationButtons}>
          <button className={styles.backButton} onClick={handleBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
