import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

function LandingCalendar() {
    return (
        <View style={styles.container}>
            <Calendar
                horizontal={true}
                pagingEnabled={true}
                // Set custom calendarWidth.
                calendarWidth={320}
                style={styles.calendar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Dimensions.get('window').height * 0.1,
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