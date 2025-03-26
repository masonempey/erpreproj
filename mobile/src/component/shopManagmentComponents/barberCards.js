import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  Image 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function BarberCard({ barberInfo, backgroundColor, navigation }) {
  const handleBarberClick = () => {
    navigation.navigate("profilePage", { barberId: barberInfo.barber_id });
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor }]}
      onPress={handleBarberClick}
      activeOpacity={0.8}
    >
      {/* Profile Image Placeholder */}
      <View style={styles.imageContainer}>
        {barberInfo.image_url ? (
          <Image 
            source={{ uri: barberInfo.image_url }} 
            style={styles.profileImage}
          />
        ) : (
          <Ionicons name="person-circle" size={60} color="#5F402C" />
        )}
      </View>

      {/* Barber Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.barberName}>{barberInfo.name}</Text>
        <Text style={styles.barberSpecialty}>{barberInfo.specialty || "Professional Barber"}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{barberInfo.rating || "4.8"}</Text>
        </View>

        <View style={styles.contactContainer}>
          <Ionicons name="call" size={14} color="#5F402C" />
          <Text style={styles.contactText}>{barberInfo.phone || "N/A"}</Text>
        </View>
      </View>

      {/* Right Chevron */}
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color="#5F402C" 
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  barberSpecialty: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#5F402C',
    marginLeft: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#5F402C',
    marginLeft: 6,
  },
  chevron: {
    marginLeft: 'auto',
  },
});