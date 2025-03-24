//similar to the landing page, this page will filter the barbers upcoming
//appointments by a day, eventually we will also make it so that by pressing
//a day on the calander in the whome page, it will redirect the barber to
//this page, filtered for the day they clicked.
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import testAppointments from "../utilities/testing/testAppointments.json";
import AppointmentDayView from "../component/schedulePageComponents/appointmentList";

export default function SchedulingPage({ route }) {
  const [appointments, setAppointments] = useState([]);
  // Get the current date from route params
  const date = route.params?.selectedDate || new Date().toISOString().split('T')[0];

  const fetchBarberAppointmentsForDate = async (date) => {
    try {
      // Using hardcoded barberId for now, will be replaced with the actual logged-in barber ID
      // since the barber table with the barber roles still need more configuration 
      // to be able to get the barber ID
      const barberId = "barber2";
      const response = await fetch(`http://10.0.0.163:3000/api/appointments/barbers/${barberId}?date=${date}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const appointmentData = await response.json();

      // Set the appointments state with the fetched appointment data
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  // Update the title when date changes
  useEffect(() => {
    fetchBarberAppointmentsForDate(date);
  }, [date]);

  return (
    <View>
      <Text>Appointments for {date.substr(0, 10)}</Text>
      <AppointmentDayView 
        appointmentData={appointments}
        date={date}
      />
    </View>
  );

};
