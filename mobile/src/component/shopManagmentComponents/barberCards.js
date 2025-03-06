import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BarberCard({ barberInfo, backgroundColor, navigation }) {
  const handleBarberClick = () => {
    // Navigate to the ProfilePage tab with the barberId as a parameter
    navigation.navigate("profilePage", { barberId: barberInfo.barber_id });
  };

  return (
    <TouchableOpacity
      style={{ backgroundColor, padding: 10 }}
      onPress={handleBarberClick} // Add the click handler
    >
      <Text style={styles.barberName}>{barberInfo.barber_name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  barberName: {
    fontSize: 16,
  },
});