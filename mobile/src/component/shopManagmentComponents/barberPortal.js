import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarberCard from './barberCards';

const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS;

const BarberPortal = ({ navigation }) => {
  // State management
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [emailError, setEmailError] = useState('');

  const getRoleName = (role_id) => {
    switch (role_id) {
      case 1: return 'User';
      case 2: return 'Admin';
      case 3: return 'Barber';
      default: return 'Unknown';
    }
  };

  // Fetch barbers data
  const fetchBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${ip_address}:3000/api/users/barber-role`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setBarbers(data);
    } catch (err) {
      console.error("Failed to fetch barbers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBarbers();
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setIsAssignModalVisible(false);
    setSearchEmail('');
    setFoundUser(null);
    setEmailError('');
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Search user by email
  const searchUserByEmail = async () => {
    if (!validateEmail(searchEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setLoading(true);
  
    try {
      // First check if user exists
      const checkResponse = await fetch(`${ip_address}:3000/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: searchEmail })
      });
  
      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        throw new Error(errorData.error || 'Failed to validate email');
      }
  
      const { exists, user_id, current_role } = await checkResponse.json();
      
      if (!exists) {
        throw new Error('User not found');
      }
  
      // If exists, get full user details
      const userResponse = await fetch(
        `${ip_address}:3000/api/email/${encodeURIComponent(searchEmail)}`
      );
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || 'Failed to get user details');
      }
  
      const user = await userResponse.json();
      setFoundUser(user);
      
    } catch (error) {
      setEmailError(error.message.includes('email') ? error.message : 'Failed to find user');
      setFoundUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Assign barber role
  const assignBarberRole = async () => {
    if (!foundUser) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${ip_address}:3000/api/users`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: foundUser.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign barber role');
      }

      const { user: updatedUser } = await response.json();
      
      // Show success state in modal
      setFoundUser({
        ...updatedUser,
        successMessage: `${updatedUser.email} is now a barber`
      });
      
      // Refresh the barbers list
      await fetchBarbers();
      
    } catch (err) {
      console.error("Role assignment error:", err);
      setEmailError(err.message.includes("barber") 
        ? err.message 
        : 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (text) => {
    setSearchEmail(text);
    setEmailError('');
  };

  // Initial data fetch
  useEffect(() => {
    fetchBarbers();
  }, []);

  // Render loading state
  if (loading && !refreshing && barbers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5F402C" />
      </View>
    );
  }

  // Render error state
  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchBarbers}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Barbers</Text>
      </View>

      {/* Barbers List */}
      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BarberCard barberInfo={item} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>No barbers available</Text>
            <Text style={styles.emptySubtext}>Add a barber by assigning the role</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5F402C"
          />
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsAssignModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Assign Barber Role Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAssignModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Barber Role</Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              >
                <Ionicons name="close" size={22} color="#777" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {foundUser?.successMessage ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                  <Text style={styles.successText}>{foundUser.successMessage}</Text>
                  <TouchableOpacity
                    style={styles.successButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.successButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.inputLabel}>Search User by Email</Text>
                  <TextInput
                    style={[styles.inputField, emailError && styles.inputError]}
                    placeholder="Enter user's email"
                    placeholderTextColor="#999"
                    value={searchEmail}
                    onChangeText={handleInputChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                  <TouchableOpacity
                    style={[styles.searchButton, (!searchEmail.trim() || loading) && {opacity: 0.7}]}
                    onPress={searchUserByEmail}
                    disabled={!searchEmail.trim() || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.searchButtonText}>Search User</Text>
                    )}
                  </TouchableOpacity>

                  {foundUser && !foundUser.successMessage && (
                    <View style={styles.userInfoContainer}>
                      <Text style={styles.userInfoText}>User Found</Text>
                      <Text style={styles.userEmail}>{foundUser.email}</Text>
                      <Text style={styles.userCurrentRole}>
                        Current Role: {getRoleName(foundUser.role_id)}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {!foundUser?.successMessage && (
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.assignButton,
                    (!foundUser || loading) && styles.assignButtonDisabled
                  ]}
                  onPress={assignBarberRole}
                  disabled={!foundUser || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.assignButtonText}>Assign Role</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#5F402C',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5F402C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: Dimensions.get('window').width - 48,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 15,
    backgroundColor: '#fcfcfc',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff9f9',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 13,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#5F402C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 2,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  userInfoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#5F402C',
  },
  userInfoText: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  userEmail: {
    marginBottom: 6,
    color: '#444',
  },
  userCurrentRole: {
    color: '#666',
    fontSize: 13,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  assignButton: {
    backgroundColor: '#5F402C',
  },
  assignButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  assignButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  successButton: {
    marginTop: 20,
    backgroundColor: '#5F402C',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  successButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BarberPortal;