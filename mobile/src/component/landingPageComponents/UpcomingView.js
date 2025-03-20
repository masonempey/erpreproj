import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import UpcomingViewCard from "./UpcomingCards";

// UpcomingView component to display the upcoming appointments
// This component displays the upcoming appointments in a list format
// It uses the FlatList component from react-native to display the list of appointments
// The FlatList component takes the appointmentData as a prop which is an array of appointments

export default function UpcomingView({ appointmentData}) {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.title}>Upcoming Appointment</Text>
            <View style={styles.divider}></View>

            {/* FlatList component to display the list of appointments
                The renderItem prop is used to render each item in the list pretty much like a map function
                The keyExtractor prop is used to extract the key for each item in the list because
                each item in the list should have a unique key to identify it in the list
                The ListEmptyComponent prop is used to display a message when the list is empty
                reference: https://reactnative.dev/docs/flatlist
            */}
            <FlatList
                data={appointmentData}
                renderItem={({ item }) => (
                    <UpcomingViewCard
                    appointmentInfo={item}
                    />
                )}

                // KeyExtractor is used to extract the key for each item in the list
                // by default, the keyExtractor uses the index of the item in the list
                // but in this case, we want to use the id of the item as the key. 
                keyExtractor={(item, index) => item.id ? item.id.toString() : `index-${index}`}
                style={styles.list}
                contentContainerStyle={appointmentData.length === 0 ? styles.emptyContainer : null}

                
                // ListEmptyComponent is used to display a message when the list is empty
                // In this case, it displays "No upcoming appointments" when the list is empty
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
        flex: 1,
        marginVertical: 10,
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
        marginTop: 20,
        paddingHorizontal: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#b3b3b3",
        marginVertical: 10,
    },
});
