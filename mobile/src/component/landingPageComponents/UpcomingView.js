import React from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import UpcomingViewCard from "./UpcomingCards";
import Ionicons from 'react-native-vector-icons/Ionicons';

// UpcomingView component to display the upcoming appointments
// This component displays the upcoming appointments in a list format
// It uses the FlatList component from react-native to display the list of appointments
// The FlatList component takes the appointmentData as a prop which is an array of appointments

export default function UpcomingView({ appointmentData, isLoading }) {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.title}>
                Upcoming 3 latest Appointments
                <Ionicons name="caret-up-outline" size={16} />
            </Text>
            <View style={styles.divider}></View>

            {/* Loading state */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading appointments...</Text>
                </View>
            ) : (
                /* FlatList component to display the list of appointments
                   The renderItem prop is used to render each item in the list pretty much like a map function
                   The keyExtractor prop is used to extract the key for each item in the list because
                   each item in the list should have a unique key to identify it in the list
                   The ListEmptyComponent prop is used to display a message when the list is empty
                   reference: https://reactnative.dev/docs/flatlist
                */
                <FlatList
                    data={appointmentData}
                    renderItem={({ item }) => (
                        <UpcomingViewCard
                        appointmentInfo={item}
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
            )}
            <View style={styles.divider}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginVertical: 10,
        marginTop: 0,
        backgroundColor: "#f9f9f9",
    },
    list: {
        paddingHorizontal: 14,
    },
    emptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
    },
    title: {
        fontWeight: "bold",
        paddingHorizontal: 16,
        fontSize: 18,
        color: "#333",
        backgroundColor: "white",
        paddingVertical: 10,
        
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
});