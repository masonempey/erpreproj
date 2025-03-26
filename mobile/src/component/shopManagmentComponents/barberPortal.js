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
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarberCard from './barberCards';

const BarberPortal = ({ navigation }) => {
  // State management
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isAddBarberModalVisible, setIsAddBarberModalVisible] = useState(false);
  const [newBarber, setNewBarber] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: ''
  });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const { width } = Dimensions.get('window');

  // Fetch barbers data
  const fetchBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://10.245.24.135:3000/api/barbers");
      
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

  // Submit new barber
  const submitNewBarber = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!newBarber.name.trim()) {
        throw new Error("Barber name is required");
      }

      const response = await fetch("http://10.245.24.135:3000/api/barbers", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBarber)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add barber');
      }

      const result = await response.json();
      
      // Update local state immediately
      setBarbers(prev => [result, ...prev]);
      
      // Reset form and close modal
      setNewBarber({ name: '', email: '', phone: '', specialty: '' });
      setIsAddBarberModalVisible(false);
      
      Alert.alert("Success", "Barber added successfully");
    } catch (err) {
      console.error("Error adding barber:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setNewBarber(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendBarberInvitation = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setLoading(true);

    try {
      // API Endpoint not exist right now in development
      const response = await fetch("http://10.245.24.135:3000/api/invite-barber", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      Alert.alert(
        'Invitation Sent',
        `An invitation has been sent to ${email}. The barber will receive instructions to complete their registration.`,
        [
          { text: 'OK', onPress: () => {
            setIsInviteModalVisible(false);
            setEmail('');
          }}
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
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
        keyExtractor={(item) => item.barber_id.toString()}
        renderItem={({ item }) => (
          <BarberCard barberInfo={item} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>No barbers available</Text>
            <Text style={styles.emptySubtext}>Add your first barber</Text>
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
        onPress={() => setIsAddBarberModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Barber Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddBarberModalVisible}
        onRequestClose={() => setIsAddBarberModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Barber</Text>
              <TouchableOpacity onPress={() => setIsAddBarberModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.inputField}
                placeholder="John Doe"
                value={newBarber.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputField}
                placeholder="john@example.com"
                value={newBarber.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.inputField}
                placeholder="(123) 456-7890"
                value={newBarber.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Specialty</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Haircuts, Shaves, etc."
                value={newBarber.specialty}
                onChangeText={(text) => handleInputChange('specialty', text)}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddBarberModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, 
                  (!newBarber.name.trim() || loading) && styles.saveButtonDisabled]}
                onPress={submitNewBarber}
                disabled={!newBarber.name.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Barber</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Invite Barber Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isInviteModalVisible}
        onRequestClose={() => setIsInviteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Barber</Text>
              <TouchableOpacity onPress={() => setIsInviteModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Barber's Email Address *</Text>
              <TextInput
                style={[styles.inputField, emailError && styles.inputError]}
                placeholder="barber@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <Text style={styles.helperText}>
                An invitation email with setup instructions will be sent to this address.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsInviteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.inviteButton]}
                onPress={sendBarberInvitation}
                disabled={loading || !email}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.inviteButtonText}>Send Invitation</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 24,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#5F402C',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  inviteButton: {
    backgroundColor: '#5F402C',
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: '600',
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
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#5F402C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default BarberPortal;