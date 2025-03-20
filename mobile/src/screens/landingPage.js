//this is our landing/barber home page, this is the first page the barber will see when they open our app.
//this page contains things like the very next appointments the barber has, so they can quickly check
//their schedule.
"use client";

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import LandingCalendar from "../component/landingPageComponents/Calander";
import UpcomingView from "../component/landingPageComponents/UpcomingView";

function LandingPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    return `${year}-${month}-${day}`;
  };
  const handleDateSelect=(date)=>{
    setSelectedDate(date)
  }

  const fetchBarberAppointmentsForDate = async (date) => {
    try {
      const barberId = "barber2";
      const response = await fetch(`http://10.0.0.163:3000/api/appointments/barbers/${barberId}?date=${date}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const appointmentData = await response.json();
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(()=>{
    if (selectedDate){
      fetchBarberAppointmentsForDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(()=>{
    setSelectedDate(getCurrentDate());
  },[])
  return (
    <View>
      <LandingCalendar onDateSelect={handleDateSelect}/>
      <UpcomingView appointmentData={appointments} />
    </View>
  );
}

export default LandingPage;
