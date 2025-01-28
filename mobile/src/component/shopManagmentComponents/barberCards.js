import React from "react";
import {TouchableOpacity, Text} from "react-native";

export default function BarberCard({barberInfo, backgroundColor}) {
    return(
        <TouchableOpacity style={{ backgroundColor, padding: 10 }}>
            <Text>{barberInfo.barber_name}</Text>
        </TouchableOpacity>
    );
}