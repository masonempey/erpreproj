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

  // Extract name from email (everything before @)
  const displayName = barberInfo.email.split('@')[0];
  const formattedEmail = barberInfo.email.length > 20 
    ? `${barberInfo.email.substring(0, 18)}...` 
    : barberInfo.email;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor }]}
      onPress={handleBarberClick}
      activeOpacity={0.8}
    >
      {/* Profile Image with Email Initial */}
      <View style={styles.imageContainer}>
        {barberInfo.image_url ? (
          <Image 
            source={{ uri: barberInfo.image_url }} 
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Barber Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.barberName}>{displayName}</Text>
        <Text style={styles.barberEmail}>{formattedEmail}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.detailText}>{barberInfo.rating || "4.8"}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="call" size={14} color="#5F402C" />
            <Text style={styles.detailText}>{barberInfo.phone_number || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Right Chevron */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color="#7f8c8d" 
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  initialsCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0288d1',
  },
  infoContainer: {
    flex: 1,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  barberEmail: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#5F402C',
    marginLeft: 4,
  },
  chevron: {
    marginLeft: 'auto',
    opacity: 0.7,
  },
});