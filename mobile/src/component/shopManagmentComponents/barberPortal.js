import React from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import BarberCard from "./barberCards";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BarberPortal({ barbers, navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={barbers}
        renderItem={({ item, index }) => (
          <BarberCard
            barberInfo={item}
            backgroundColor={index % 2 === 0 ? "#f8f9fa" : "#ffffff"}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.barber_id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No barbers available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
});