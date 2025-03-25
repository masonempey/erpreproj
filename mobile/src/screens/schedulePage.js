//similar to the landing page, this page will filter the barbers upcoming
//appointments by a day, eventually we will also make it so that by pressing
//a day on the calander in the whome page, it will redirect the barber to
//this page, filtered for the day they clicked.
"use client";

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AppointmentDayView from "../component/schedulePageComponents/appointmentList";

export default function SchedulingPage({ route }) { 
  // Manage the state of appointments and loading status
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the current date from route params with fallback to today's date
  const date = route.params?.selectedDate || new Date().toISOString().split('T')[0];

  // Function to fetch the barber appointments for the selected date
  // This function fetches the barber appointments for the selected date from the server
  // by passing the selected date as an argument.
  // The function uses the fetch API to make a GET request to the server to fetch the appointments 
  // for the selected date.
  // The reason to use async/await is to make the function asynchronous and
  // to wait for the response of the fetch request to be resolved and get the data
  // from the server before proceeding further.
  const fetchBarberAppointmentsForDate = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Using hardcoded barberId for now, will be replaced with the actual logged-in barber ID
      // since the barber table with the barber roles still need more configuration 
      // to be able to get the barber ID
      const barberId = "barber2";
      const response = await fetch(`http://10.0.0.163:3000/api/appointments/barbers/${barberId}?date=${date}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const appointmentData = await response.json();
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to fetch appointments whenever the date changes
  // This is done by passing the date as a dependency to the useEffect hook.
  useEffect(() => {
    fetchBarberAppointmentsForDate(date);
  }, [date]);

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading appointments for {date}...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
        <Text>Could not load appointments for {date}</Text>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Appointments for {date}</Text>
      <AppointmentDayView 
        appointmentDetails={appointments}
        selectedDate={date}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  }
});