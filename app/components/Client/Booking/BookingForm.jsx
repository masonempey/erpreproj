import React from "react";
import { useBooking } from "../../../../context/BookingContext";
import SelectService from "./SelectService";
import ChooseBarber from "./ChooseBarber";
import ChooseDateTime from "./ChooseDateTime";
import PersonalInfo from "./PersonalInfo";
import PaymentForm from "./paymentForm";
import Confirmation from "./Confirmation";
import styles from "../styles/Booking.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BookingForm({ onClose }) {
  const { state, dispatch } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <ChooseBarber />; // First step is now barber selection
      case 2:
        return <SelectService />; // Second step is service selection
      case 3:
        return <ChooseDateTime />;
      case 4:
        return <PersonalInfo />;
      case 5:
        return <PaymentForm />;
      case 6:
        return <Confirmation onClose={onClose} />;
      default:
        return <ChooseBarber />;
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
          <button
            className={styles.backButton}
            onClick={handleBack}
            aria-label="Go back to previous step"
          >
            <ArrowBackIcon />
          </button>
        </div>
      )}
    </div>
  );
}
