import React from "react";
import { useBooking } from "../../../../context/BookingContext";
import styles from "../styles/BookingSteps.module.css";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const steps = [
  { id: 1, name: "Barber" },
  { id: 2, name: "Service" },
  { id: 3, name: "Date & Time" },
  { id: 4, name: "Details" },
  { id: 5, name: "Payment" },
  { id: 6, name: "Confirmation" },
];

const mobileSteps = [
  { id: 1, name: "Barber" },
  { id: 2, name: "Service" },
  { id: 3, name: "Time" },
  { id: 4, name: "Info" },
  { id: 5, name: "Pay" },
  { id: 6, name: "Done" },
];

export default function BookingSteps() {
  const { state } = useBooking();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:400px)");

  const displaySteps = isSmallMobile ? mobileSteps : steps;

  return (
    <div
      className={`${styles.stepsContainer} ${
        isMobile ? styles.mobileSteps : ""
      }`}
    >
      {displaySteps.map((step) => (
        <div
          key={step.id}
          className={`${styles.step} ${
            state.step >= step.id ? styles.active : ""
          }`}
        >
          <div
            className={`${styles.stepNumber} ${
              isMobile ? styles.mobileStepNumber : ""
            }`}
          >
            {step.id}
          </div>
          <div
            className={`${styles.stepLabel} ${
              isMobile ? styles.mobileStepLabel : ""
            }`}
          >
            {step.name}
          </div>
        </div>
      ))}
    </div>
  );
}
