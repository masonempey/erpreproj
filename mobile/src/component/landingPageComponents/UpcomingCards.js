//creating the cards or areas that we are going to be using to display the appointment information in
//for the barber page within the flat list.
import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function UpcomingViewCard({AppointmentInformation, backgroundColor}) {
    var date = new Date(AppointmentInformation.date);
    return (
        <View style={[styles.card]}>
            <Text>
                <Text style={styles.label}>Date: </Text>
                {date.toLocaleString()}
            </Text>
            <Text>
                <Text style={styles.label}>Name: </Text>
                {AppointmentInformation.guest_name}
            </Text>
            <Text>
                <Text style={styles.label}>Phone Number: </Text>
                {AppointmentInformation.guest_phone}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#fcfcfc",
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        boxShadow: "0 0 3"
    },
    label: {
        fontWeight: "bold",
    },
})