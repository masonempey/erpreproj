// ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { AuthContext } from '../firebase/firebase-context';
import { Ionicons } from '@expo/vector-icons';

const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS;

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserDetails = async () => {
    try {
      if (!user?.uid) return;
      
      const response = await fetch(`${ip_address}/api/users?action=byId&id=${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserDetails();
  };

  // Fallback image URL or initials
  const getAvatar = () => {
    if (user?.photoURL) {
      return { uri: user.photoURL };
    }
    return require('../../assets/logo.png');
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(name => name[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5F402C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
        <Ionicons 
          name="refresh-circle" 
          size={40} 
          color="#5F402C" 
          onPress={onRefresh}
          style={{ marginTop: 10 }}
        />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#5F402C']}
          tintColor="#5F402C"
        />
      }
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={getAvatar()} style={styles.avatar} />
          ) : (
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{getInitials()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>
          {userDetails?.displayName || user?.displayName || 'User'}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || 'No email provided'}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Ionicons name="mail" size={20} color="#5F402C" style={styles.icon} />
          <Text style={styles.detailText}>
            {user?.email || 'Email not available'}
          </Text>
        </View>

        {userDetails?.phone_number && (
          <View style={styles.detailItem}>
            <Ionicons name="phone-portrait" size={20} color="#5F402C" style={styles.icon} />
            <Text style={styles.detailText}>
              {userDetails.phone_number}
            </Text>
          </View>
        )}

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#5F402C" style={styles.icon} />
          <Text style={styles.detailText}>
            Joined: {new Date(user?.metadata?.creationTime).toLocaleDateString() || 'Unknown'}
          </Text>
        </View>

        {/* Additional fields from your API */}
        {userDetails?.role_id && (
          <View style={styles.detailItem}>
            <Ionicons name="person-circle" size={20} color="#5F402C" style={styles.icon} />
            <Text style={styles.detailText}>
              Role: {getRoleName(userDetails.role_id)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Helper function to display role names
const getRoleName = (role_id) => {
  switch (role_id) {
    case 1: return 'User';
    case 2: return 'Admin';
    case 3: return 'Barber';
    default: return 'Unknown';
  }
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#5F402C',
  },
  initialsAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5F402C',
  },
  initialsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0288d1',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  icon: {
    marginRight: 15,
    width: 24,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
});

export default ProfilePage;