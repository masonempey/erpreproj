// BookingContext.jsx
"use client";

import React, { createContext, useReducer, useContext } from "react";
import { useUser } from "./UserContext";

const BookingContext = createContext();

const initialState = {
  step: 1,
  service: null,
  serviceId: null,
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
    case "SELECT_SERVICE":
      return {
        ...state,
        service: action.payload.name,
        serviceId: action.payload.id,
        step: 2,
      };
    case "SELECT_BARBER":
      return {
        ...state,
        barber: action.payload.name,
        barberId: action.payload.id,
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
    case "BOOKING_SUCCESS":
      return {
        ...state,
        appointment: action.payload,
        step: 6,
        loading: false,
      };
    case "GO_BACK":
      return {
        ...state,
        step: state.step - 1,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const BookingProvider = ({ children }) => {
  const { user } = useUser();
  // Initialize with user data
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

  const createAppointment = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: state.date.format("YYYY-MM-DD") + "T" + state.time,
          userId: user?.uid || null,
          barberId: state.barberId,
          guestName: state.personalInfo.fullName,
          guestEmail: state.personalInfo.email,
          guestPhone: state.personalInfo.phone,
          guestAddress: state.personalInfo.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      return await response.json();
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
