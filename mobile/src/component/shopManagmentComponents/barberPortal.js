import React from "react";
import { FlatList } from "react-native";
import BarberCard from "./barberCards";

export default function BarberPortal({ barbers, navigation }) {
  return (
    <FlatList
      data={barbers}
      renderItem={({ item, index }) => {
        return (
          <BarberCard
            barberInfo={item}
            backgroundColor={index % 2 === 0 ? "#f0f0f0" : "#ffffff"}
            navigation={navigation} // Pass the navigation prop to BarberCard
          />
        );
      }}
      keyExtractor={(item) => item.barber_id} // Add a keyExtractor for better performance
    />
  );
}