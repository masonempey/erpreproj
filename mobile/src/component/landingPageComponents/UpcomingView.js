import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import UpcomingViewCard from "./UpcomingCards";

export default function UpcomingView({ appointmentData}) {
    return (
        <FlatList
            data={appointmentData}
            renderItem={({ item, index }) => (
                <UpcomingViewCard
                    AppointmentInformation={item}
                    backgroundColor={index % 2 === 0 ? "#f0f0f0" : "#ffffff"}
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
    );
}

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 16,
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
});
