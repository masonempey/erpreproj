//creating the cards or areas that we are going to be using to display the appointment information in
//for the barber page within the flat list.
import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function UpcomingViewCard({AppointmentInformation}) {
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
        marginTop: 10,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "rgb(0, 0, 0)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4
    },
    label: {
        fontWeight: "bold",
    },
})