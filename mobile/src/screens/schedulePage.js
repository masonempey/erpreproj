"use client";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AppointmentDayView from "../component/schedulePageComponents/appointmentList";

export default function SchedulingPage({ route }) { 
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const date = route.params?.selectedDate || new Date().toISOString().split('T')[0];

  const fetchBarberAppointmentsForDate = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      
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

  useEffect(() => {
    fetchBarberAppointmentsForDate(date);
  }, [date]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading appointments for {date}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Appointments</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Could not load appointments for {date}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Appointments for {date}</Text>
      </View>
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
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    margin: 10,
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d3436',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#636e72',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d63031',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#d63031',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#636e72',
  }
});