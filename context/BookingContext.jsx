// context/BookingContext.jsx
"use client";

import React, { createContext, useReducer, useContext } from "react";
import { useUser } from "./UserContext";

const BookingContext = createContext();

const initialState = {
  step: 1,
  service: null,
  serviceId: null,
  serviceDuration: null,
  servicePrice: null,
  barber: null,
  barberId: null,
  date: null,
  time: null,
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
  },
  loading: false,
  error: null,
};

function bookingReducer(state, action) {
  switch (action.type) {
    case "SELECT_BARBER":
      return {
        ...state,
        barber: action.payload.name,
        barberId: action.payload.id,
        step: 2,
      };
    case "SELECT_SERVICE":
      return {
        ...state,
        service: action.payload.name,
        serviceId: action.payload.id,
        serviceDuration: action.payload.duration,
        servicePrice: action.payload.price,
        step: 3,
      };
    case "SELECT_DATETIME":
      return {
        ...state,
        date: action.payload.date,
        time: action.payload.time,
        step: 4,
      };
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: action.payload,
        step: 5,
      };
    case "BOOKING_SUCCESS":
      return {
        ...state,
        appointment: action.payload,
        step: 6,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "GO_BACK":
      return {
        ...state,
        step: state.step - 1,
      };
    case "RESET_BOOKING":
      return {
        ...initialState,
        personalInfo: state.personalInfo,
      };
    default:
      return state;
  }
}

export const BookingProvider = ({ children }) => {
  const { user } = useUser();

  // Initialize with any user data we have
  const initialStateWithUserData = {
    ...initialState,
    personalInfo: user
      ? {
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          address: user.address || "",
          postalCode: "",
        }
      : initialState.personalInfo,
  };

  const [state, dispatch] = useReducer(
    bookingReducer,
    initialStateWithUserData
  );

  /**
   * Creates a new appointment in the backend.
   * @param {{ paymentIntentId: string }} opts
   */
  const createAppointment = async ({ paymentIntentId }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      console.log(
        "Attempting to create appointment with duration:",
        state.serviceDuration
      );
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          date: `${state.date}T${state.time}`,
          userId: user?.uid || null,
          barberId: state.barberId,
          serviceId: state.serviceId,
          serviceDuration: state.serviceDuration,
          guestName: state.personalInfo.fullName,
          guestEmail: state.personalInfo.email,
          guestPhone: state.personalInfo.phone,
          guestAddress: state.personalInfo.address,
          paymentIntentId, // ← forward the Stripe PaymentIntent ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      const result = await response.json();
      console.log("Appointment created:", result);

      dispatch({
        type: "BOOKING_SUCCESS",
        payload: result.appointment,
      });

      return result;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <BookingContext.Provider value={{ state, dispatch, createAppointment }}>
      {children}
    </BookingContext.Provider>
  );
};

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
