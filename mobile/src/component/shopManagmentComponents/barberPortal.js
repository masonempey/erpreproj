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

  // Simplified role colors mapping (aligning with web)
  const roleColors = {
    User: "#777",
    Admin: "#ff9800",
    Barber: "#4caf50"
  };

  // Fetch all barbers with error handling
  const fetchBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using the consolidated API endpoint with no parameters to get all barbers
      const response = await fetch(`${ip_address}/api/barbers`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
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

  // Search user by email with validation
  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) {
      setEmailError('Please enter an email address');
      return;
    }
    if (!validateEmail(searchEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setLoading(true);
  
    try {
      // Using the same API endpoint as the web version
      const response = await fetch(
        `${ip_address}/api/users?action=byEmail&email=${encodeURIComponent(searchEmail)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find user');
      }
      
      const user = await response.json();
      console.log("API Response:", user); // Debug log
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Transform the user object to match the expected format
      setFoundUser({
        ...user,
        currentRole: user.IsBarber ? "Barber" : user.IsAdmin ? "Admin" : "User",
        name: user.name || "No name provided",
        barber_id: user.user_id // Map user_id to barber_id if needed
      });
      
    } catch (err) {
      setEmailError(err.message);
      setFoundUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Assign barber role matching web implementation
  const assignBarberRole = async () => {
    if (!foundUser) return;
    setLoading(true);
    try {
      // Update user's IsBarber flag using the same API as web
      const updateResponse = await fetch(`${ip_address}/api/users?userId=${foundUser.user_id}&action=makeBarber`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: foundUser.name,
          email: foundUser.email
        })
      });
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update user role");
      }
  
      const result = await updateResponse.json();
      
      // Update local state to match web implementation
      setBarbers(prev => [...prev, {
        ...result.barber,
        currentRole: "Barber",
        barber_id: result.barber.barber_id || result.barber.id
      }]);
      
      // Show success message
      setFoundUser({
        ...foundUser,
        successMessage: `${foundUser.name} is now a Barber!`
      });
      
    } catch (err) {
      console.error("Role assignment error:", err);
      setEmailError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format time display (same as web)
  const formatTimeDisplay = (time) => {
    if (!time) return "Not available";
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    return `${hourNum % 12 || 12}:${minutes} ${hourNum >= 12 ? 'PM' : 'AM'}`;
  };

  // Initial data fetch
  useEffect(() => {
    fetchBarbers();
  }, []);

  // Handle input changes
  const handleInputChange = (text) => {
    setSearchEmail(text);
    setEmailError('');
  };

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
        <Text style={styles.headerTitle}>Manage Barber Roles</Text>
      </View>

      {/* Barbers List */}
      <FlatList
        data={barbers}
        keyExtractor={(item) => (item.id || item.barber_id).toString()}
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
              <Text style={styles.modalTitle}>Find User</Text>
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
                  <TextInput
                    style={[styles.inputField, emailError && styles.inputError]}
                    placeholder="User Email"
                    placeholderTextColor="#999"
                    value={searchEmail}
                    onChangeText={handleInputChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                  {!loading && foundUser && (
                    <View style={styles.userInfoContainer}>
                      <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                          {foundUser.name?.charAt(0) || 'U'}
                        </Text>
                      </View>
                      <View style={styles.userDetailsContainer}>
                        <Text style={styles.userName}>{foundUser.name}</Text>
                        <Text style={styles.userEmail}>{foundUser.email}</Text>
                        <View style={styles.chipContainer}>
                          <View style={[
                            styles.roleChip, 
                            {backgroundColor: roleColors[foundUser.currentRole] || "#777"}
                          ]}>
                            <Text style={styles.roleChipText}>{foundUser.currentRole}</Text>
                          </View>
                          {foundUser.phone_number && (
                            <View style={styles.phoneChip}>
                              <Text style={styles.phoneChipText}>Phone: {foundUser.phone_number}</Text>
                            </View>
                          )}
                        </View>
                      </View>
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
                
                {foundUser ? (
                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.assignButton,
                      loading && styles.assignButtonDisabled
                    ]}
                    onPress={assignBarberRole}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons name="person-add" size={16} color="white" style={styles.buttonIcon} />
                        <Text style={styles.assignButtonText}>Assign as Barber</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.modalButton, 
                      styles.assignButton,
                      (!searchEmail.trim() || loading) && styles.assignButtonDisabled
                    ]}
                    onPress={searchUserByEmail}
                    disabled={!searchEmail.trim() || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.assignButtonText}>Search</Text>
                    )}
                  </TouchableOpacity>
                )}
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
  userInfoContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  userDetailsContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  roleChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  phoneChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 4,
  },
  phoneChipText: {
    color: '#666',
    fontSize: 12,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 6,
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