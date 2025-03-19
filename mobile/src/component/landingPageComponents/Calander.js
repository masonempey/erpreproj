import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

function LandingCalendar() {
    const getCurrentDate=()=>{
 
        var date = new Date().getDate() + 1;
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        return year + '-' + month + '-' + date;
  }
    return (
        <View style={styles.container}>
            <Calendar
                horizontal={true}
                pagingEnabled={true}
                enableSwipeMonths={true}
                minDate = {getCurrentDate()}
                // Set custom calendarWidth.
                calendarWidth={320}
                style={styles.calendar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
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