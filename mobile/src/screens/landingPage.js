//this is our landing/barber home page, this is the first page the barber will see when they open our app.
//this page contains things like the very next appointments the barber has, so they can quickly check
//their schedule.
"use client";

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import LandingCalendar from "../component/landingPageComponents/Calander";
import testAppointments from "../utilities/testing/testAppointments.json";
import UpcomingView from "../component/landingPageComponents/UpcomingView";

function LandingPage() {
  const [appointments, setAppointments] = useState([]);

  // Using query so no need for sort function
  useEffect(() => {
    const fetchBarberAppointments = async () => {
      try {
        const barberId = "barber2";
        const response = await fetch(`http://10.174.167.208:3000/api/appointments/barbers/${barberId}`);
        const appointmentData = await response.json();

        console.log(appointmentData);
        setAppointments(appointmentData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBarberAppointments();


  }, []);

  return (
    <View>
      {/*
                passing in our appointment list as props for our components.
            */}
      <UpcomingView appointmentData={appointments} />
      <LandingCalendar />
    </View>
  );
}

export default LandingPage;
