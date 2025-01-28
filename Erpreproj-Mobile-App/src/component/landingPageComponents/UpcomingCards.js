//creating the cards or areas that we are going to be using to display the appointment information in
//for the barber page within the flat list.
import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function UpcomingViewCard({AppointmentInformation, backgroundColor}) {
    /*
        I had chat gpt generate me test json data to use before we could get our routes setup, 
        it generated isodatetimes, in order to make these readable i used this article:
        https://css-tricks.com/how-to-convert-a-date-string-into-a-human-readable-format/
        you can do more to make it more readable or format the string exactly how you want, but
        i just wanted to get it so that it was readable. first we turn the string value into a date 
        object, then we can preform a toLocaleString on it (line 22)
    */
    var date = new Date(AppointmentInformation.date)
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
                {date.toLocaleString()}
            </Text>
            <Text>
                {AppointmentInformation.customer_name}
            </Text>
            <Text>
                {AppointmentInformation.haircut_type}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 5,
    }
})