import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import UpcomingViewCard from "./UpcomingCards";

export default function UpcomingView({ appointmentData}) {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.title}>Upcoming Appointment</Text>
            <View style={styles.divider}></View>
            <FlatList
                data={appointmentData}
                renderItem={({ item }) => (
                    <UpcomingViewCard
                        AppointmentInformation={item}
                    />
                )}
                keyExtractor={(item, index) => item.id ? item.id.toString() : `index-${index}`}
                style={styles.list}
                contentContainerStyle={appointmentData.length === 0 ? styles.emptyContainer : null}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No upcoming appointments</Text>
                    </View>
                )}
            />
            <View style={styles.divider}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 14,
        marginVertical: 10,
        backgroundColor: "#f9f9f9",
        
    },
    list: {
        paddingHorizontal: 14,
    },
    emptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 250,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
    title: {
        fontWeight: "bold",
        marginTop: 20,
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#b3b3b3",
        marginVertical: 10,
    },
});
