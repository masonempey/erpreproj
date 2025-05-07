"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/Booking.module.css";
import BookingForm from "./BookingForm";
import { IoClose } from "react-icons/io5";
import BookingSteps from "./BookingSteps";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BookingPopUp({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      document.body.style.overflow = "auto";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
      onClick={onClose}
    >
      <div
        className={`${styles.bookingContainer} ${
          isMobile
            ? styles.mobileContainer
            : isTablet
            ? styles.tabletContainer
            : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={isMobile ? styles.mobileHeader : ""}>
          <h2 className={isMobile ? styles.mobileHeading : ""}>
            Book Your Appointment
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close booking form"
          >
            <IoClose size={isMobile ? 20 : 24} />
          </button>
        </header>

        <BookingSteps />
        <BookingForm onClose={onClose} />
      </div>
    </div>
  );
}
