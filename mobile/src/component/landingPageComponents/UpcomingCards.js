//creating the cards or areas that we are going to be using to display the appointment information in
//for the barber page within the flat list.
import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function UpcomingViewCard({AppointmentInformation, backgroundColor}) {
    var date = new Date(AppointmentInformation.date);
    return (
        /*
            here we use our passed in color value and put it into the style,
            since our variable is already named backgroundColor, it saves us 
            a step, if it was named something like cardColor we would need to put
            backgroundColor: cardColor in the curly brackets, this is because of JS
            Object Shorthand which i thought was pretty neat.
        */
        <View style={[styles.card, {backgroundColor}]}>
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
        padding: 15,
        borderWidth: 1,
        marginVertical: 5,
    },
    label: {
        fontWeight: "bold",
    },
})