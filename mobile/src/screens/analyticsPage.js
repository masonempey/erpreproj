"use client";

import React, { useState, useEffect } from "react";
import { View, Text, Button, Dimensions } from "react-native";
import testPastAppointments from "../utilities/testing/pastAppointments.json";
import testBarbers from "../utilities/testing/testBarbers.json";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dropdown } from "react-native-element-dropdown";

export default function AnalyticsPage({ route }) {
  const { barberId } = route.params || {};
  const [selectedBarber, setSelectedBarber] = useState(barberId || "All");
  const [barbers, setBarbers] = useState([]);
  const [barberList, setBarberList] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [dateRange, setDateRange] = useState("Month");
  const [filteredType, setFilteredType] = useState("NumApp");
  const [applicableData, setApplicableData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sortedAppointments = [...testPastAppointments].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setPastAppointments(sortedAppointments);
    setApplicableData(sortedAppointments);

    const sortedBarbers = [...testBarbers].sort((a, b) =>
      a.barber_name.localeCompare(b.barber_name)
    );

    const formattedBarbers = [
      { label: "All Barbers", value: "All" },
      ...sortedBarbers.map((barber) => ({
        label: barber.barber_name,
        value: barber.barber_id,
      })),
    ];

    setBarbers(sortedBarbers);
    setBarberList(formattedBarbers);
  }, []);

  useEffect(() => {
    console.log("Filtering appointments for barber:", selectedBarber);
    let filteredAppointments = [...pastAppointments];

    if (selectedBarber !== "All") {
      const selectedBarberName = barbers.find(
        (b) => b.barber_id === selectedBarber
      )?.barber_name;
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.barber_name === selectedBarberName
      );
    }

    console.log("Filtered appointments:", filteredAppointments);
    setApplicableData(filteredAppointments);
  }, [selectedBarber, pastAppointments, barbers]);

  useEffect(() => {
    if (applicableData.length === 0) {
      console.log("No applicable data, skipping chartData update.");
      setIsLoading(false);
      return;
    }

    const currentDate = new Date();
    let labels = [];
    let data = [];

    if (dateRange === "Month") {
      const days = daysInMonth(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      labels = Array.from({ length: days }, (_, i) =>
        (i + 1) % 5 === 0 ? (i + 1).toString() : ""
      );
      data = Array(days).fill(0);

      applicableData.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        if (
          appointmentDate.getMonth() === currentDate.getMonth() &&
          appointmentDate.getFullYear() === currentDate.getFullYear()
        ) {
          data[appointmentDate.getDate() - 1] += 1;
        }
      });
    } else if (dateRange === "Year") {
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString("default", { month: "short" });
      });
      data = Array(12).fill(0);

      applicableData.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const monthDiff =
          (currentDate.getFullYear() - appointmentDate.getFullYear()) * 12 +
          (currentDate.getMonth() - appointmentDate.getMonth());
        if (monthDiff >= 0 && monthDiff < 12) {
          data[11 - monthDiff] += 1;
        }
      });
    } else if (dateRange === "All Time") {
      // Handle "All Time" filter (last 4 years)
      const years = Array.from(
        { length: 4 },
        (_, i) => currentDate.getFullYear() - (3 - i)
      );
      labels = years.map((year) => year.toString());
      data = Array(4).fill(0);

      applicableData.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const yearDiff =
          currentDate.getFullYear() - appointmentDate.getFullYear();
        if (yearDiff >= 0 && yearDiff < 4) {
          data[3 - yearDiff] += 1;
        }
      });
    }

    console.log("Generated chart data:", { labels, data });
    setChartData({
      labels: labels,
      datasets: [{ data: data }],
    });
    setIsLoading(false);
  }, [applicableData, dateRange]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const categorizeReviews = (appointments) => {
    const reviewCounts = {
      Positive: 0,
      Neutral: 0,
      Negative: 0,
    };

    const currentDate = new Date();

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      let includeReview = false;

      if (dateRange === "Month") {
        includeReview =
          appointmentDate.getMonth() === currentDate.getMonth() &&
          appointmentDate.getFullYear() === currentDate.getFullYear();
      } else if (dateRange === "Year") {
        const monthDiff =
          (currentDate.getFullYear() - appointmentDate.getFullYear()) * 12 +
          (currentDate.getMonth() - appointmentDate.getMonth());
        includeReview = monthDiff >= 0 && monthDiff < 12;
      } else if (dateRange === "All Time") {
        const yearDiff =
          currentDate.getFullYear() - appointmentDate.getFullYear();
        includeReview = yearDiff >= 0 && yearDiff < 4;
      }

      if (includeReview && appointment.star_rating) {
        if (appointment.star_rating >= 4) {
          reviewCounts.Positive += 1;
        } else if (appointment.star_rating === 3) {
          reviewCounts.Neutral += 1;
        } else {
          reviewCounts.Negative += 1;
        }
      }
    });

    return Object.entries(reviewCounts).map(([label, count]) => ({
      name: label,
      population: count,
      color:
        label === "Positive" ? "green" : label === "Neutral" ? "orange" : "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  const reviewData = categorizeReviews(applicableData);

  return (
    <View>
      <Text>Shop Performance</Text>

      <Dropdown
        data={barberList}
        value={selectedBarber}
        onChange={(item) => {
          setSelectedBarber(item.value);
          console.log(item.value);
        }}
        labelField="label"
        valueField="value"
        style={{ width: "100%", height: 50 }}
        textStyle={{ color: "black" }}
      />

      <View>
        <Button title="Month" onPress={() => setDateRange("Month")} />
        <Button title="Year" onPress={() => setDateRange("Year")} />
        <Button title="All Time" onPress={() => setDateRange("All Time")} />
      </View>

      <View>
        <Button
          title="# Appointments"
          onPress={() => setFilteredType("NumApp")}
        />
        <Button title="Reviews" onPress={() => setFilteredType("Reviews")} />
      </View>

      {filteredType === "NumApp" ? (
        isLoading || chartData.labels.length === 0 ? (
          <Text>Loading chart data...</Text>
        ) : (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix=" App"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )
      ) : (
        <PieChart
          data={reviewData}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}
    </View>
  );
}
