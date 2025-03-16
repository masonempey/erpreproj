//similar to the landing page, this page will filter the barbers upcoming
//appointments by a day, eventually we will also make it so that by pressing
//a day on the calander in the whome page, it will redirect the barber to
//this page, filtered for the day they clicked.
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import testAppointments from "../utilities/testing/testAppointments.json";
import AppointmentDayView from "../component/schedulePageComponents/appointmentList";

export default function SchedulingPage({ selectedDate }) {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date().toISOString());

  useEffect(() => {
    const sortedAppointments = [...testAppointments].sort(
      /*
                refer to landing page
                for notes on sorting.
            */
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setAppointments(sortedAppointments);
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);
  useEffect(() => {
    if (date) {
      console.log("Selected date:", date);
    }
  }, [date]);
  const handleDateIncrease = () => {
    /* https://stackoverflow.com/questions/563406/how-to-add-days-to-date */
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate.toISOString());
  };
  const handleDateDecrese = () => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate.toISOString());
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button title="Prev" onPress={handleDateDecrese} />
        <Text>Day View For: {date.substr(0, 10)}</Text>
        <Button title="Next" onPress={handleDateIncrease} />
      </View>
      <View>
        <AppointmentDayView
          appointmentDetails={appointments}
          selectedDate={date}
        />
      </View>
    </View>
  );
}

/* https://reactnative.dev/docs/button */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
