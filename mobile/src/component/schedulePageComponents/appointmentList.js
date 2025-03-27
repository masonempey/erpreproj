import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import UpcomingViewCard from "../landingPageComponents/UpcomingCards";

export default function AppointmentDayView({ appointmentDetails, selectedDate }) {
    console.log("AppointmentDayView received:", { 
        appointmentDetails, 
        selectedDate 
    });

    if (!appointmentDetails) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Loading appointments...</Text>
            </View>
        );
    }

    const appointmentsArray = Array.isArray(appointmentDetails) ? appointmentDetails : [];
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch {
            return dateString.substr(0, 10);
        }
    };

    const filteredAppointments = appointmentsArray.filter(item => {
        const appointmentDate = formatDate(item.date);
        const chosenDate = formatDate(selectedDate);
        console.log(`Comparing: ${appointmentDate} vs ${chosenDate}`);
        return appointmentDate === chosenDate;
    });

    console.log("Filtered appointments:", filteredAppointments);

    if (filteredAppointments.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No appointments for {formatDate(selectedDate) || 'this date'}</Text>
            </View>
        );
    }

    return (
        <FlatList 
            data={filteredAppointments}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
                <UpcomingViewCard
                    appointmentInfo={item}
                />
            )}
        />
    );
}