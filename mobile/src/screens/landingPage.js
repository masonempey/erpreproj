//this is our landing/barber home page, this is the first page the barber will see when they open our app.
//this page contains things like the very next appointments the barber has, so they can quickly check
//their schedule.
"use client";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import LandingCalendar from "../component/landingPageComponents/Calander";
import UpcomingView from "../component/landingPageComponents/UpcomingView";

function LandingPage() {
  // Manage the state of the appointments type array to store the appointments being fetched from the server.
  // Manage the state of the selected date to store the date selected by the user.
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    return `${year}-${month}-${day}`;
  };

  // Function that handles the date selection by the user
  // It sets the selected date to the date selected by the user whenever the user selects a date 
  // by passing the date as an argument.
  const handleDateSelect=(date)=>{
    setSelectedDate(date)
  }

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

  // UseEffect hook to fetch the appointments every time the selected date changes
  // This is done by passing the selectedDate as a dependency to the useEffect hook.
  useEffect(()=>{
    if (selectedDate){
      fetchBarberAppointmentsForDate(selectedDate);
    }
  }, [selectedDate]);

  // useEffect hook to set the selected date to the current date once when the page first loads or rendered
  // This is done by passing an empty array as the second argument to the useEffect hook.
  useEffect(()=>{
    setSelectedDate(getCurrentDate());
  },[]);

  return (
    // Render the LandingCalendar and UpcomingView components.
    // The LandingCalendar component is used to display the calendar for the barber to select the date.
    // The UpcomingView component is used to display the upcoming appointments for the barber.
    <View style={{ flex: 1, padding: 16 }}>

      {/* Pass the handleDateSelect function as a prop to the LandingCalendar component
      to handle the date selection by the user.*/}
      <LandingCalendar onDateSelect={handleDateSelect}/>

      {/* Pass the appointments state as a prop to the UpcomingView component
      to display the upcoming appointments for the barber. */}
      <View style={{ flex: 1 }}>
          <UpcomingView appointmentData={appointments} />
      </View>
    </View>
  );
}

export default LandingPage;
