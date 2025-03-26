"use client";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import LandingCalendar from "../component/landingPageComponents/Calander";
import UpcomingView from "../component/landingPageComponents/UpcomingView";
import { useNavigation } from "@react-navigation/native";

function LandingPage() {
  // Manage the state of the appointments type array to store the appointments being fetched from the server.
  // Manage the state of the selected date to store the date selected by the user.
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function that handles the date selection by the user
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    navigation.navigate('MainApp', { 
      screen: 'Schedule',
      params: { selectedDate: date }
    });
  };

  // Function to fetch the barber appointments for the selected date
  const fetchBarberAppointmentsForDate = async (date) => {
    try {
      setIsLoading(true);
      const barberId = "barber2";
      const response = await fetch(`http://10.174.167.208:3000/api/appointments/barbers/${barberId}?date=${date}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const appointmentData = await response.json();
      const sortedAndLimitedAppointments = appointmentData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setAppointments(sortedAndLimitedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to set the selected date to the current date on initial render
  useEffect(() => {
    const currentDate = getCurrentDate();
    setSelectedDate(currentDate);
    fetchBarberAppointmentsForDate(currentDate);
  }, []);

  return (
    <View style={styles.container}>
      <LandingCalendar onDateSelect={handleDateSelect}/>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <View style={styles.upcomingContainer}>
          <UpcomingView 
            appointmentData={appointments} 
            isLoading={isLoading} 
          />
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  upcomingContainer: {
    flex: 1,
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default LandingPage;