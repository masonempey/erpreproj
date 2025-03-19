import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

function LandingCalendar({onDateSelect}) {
    // Function to get the current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
        const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
        return `${year}-${month}-${day}`;
    };

    // State to store the selected date
    const [selectedDate, setSelectedDate] = useState(getCurrentDate());

    // Function to handle date selection
    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        onDateSelect(day.dateString); 
    };

    return (
        <View style={styles.container}>
            <Calendar
                horizontal={true}
                pagingEnabled={true}
                enableSwipeMonths={true}
                minDate={getCurrentDate()} // Disable past dates
                onDayPress={handleDayPress} // Handle date selection
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "#007bff" },
                }}
                calendarWidth={Dimensions.get("window").width - 20}
                style={styles.calendar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f9fa",
        padding: 10,
    },
    calendar: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});

export default LandingCalendar;