import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Keyboard,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ShopPortal({ shopInformation, callBackOnSubmit }) {
    const [formData, setFormData] = useState({
        name: shopInformation.shop_name || '',
        address: shopInformation.address || '',
        city: shopInformation.city || '',
        province: shopInformation.province || '',
        postalCode: shopInformation.postal_code || '',
        number: shopInformation.phone || '',
        email: shopInformation.email || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Validation Error', 'Shop name is required');
            return false;
        }
        if (!formData.email.trim() && !formData.number.trim()) {
            Alert.alert('Validation Error', 'Please provide at least one contact method (email or phone)');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await callBackOnSubmit(formData);
            Alert.alert('Success', 'Shop information updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update shop information');
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmSubmit = () => {
        Alert.alert(
            'Confirm Changes',
            'Are you sure you want to update the shop information?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Update', onPress: handleSubmit }
            ]
        );
    };

    return (
        <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="business" size={24} color="#2c3e50" />
                    <Text style={styles.headerText}>Shop Information</Text>
                </View>
                
                {/* Contact Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Shop Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter shop name"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholderTextColor="#999"
                            importantForAutofill="yes"
                        />
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Address</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter shop address"
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, styles.flex]}>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter city"
                                value={formData.city}
                                onChangeText={(text) => handleChange('city', text)}
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={[styles.formGroup, styles.flex, styles.leftMargin]}>
                            <Text style={styles.label}>Province</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter province"
                                value={formData.province}
                                onChangeText={(text) => handleChange('province', text)}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Postal Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter postal code"
                            value={formData.postalCode}
                            onChangeText={(text) => handleChange('postalCode', text)}
                            placeholderTextColor="#999"
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number"
                            value={formData.number}
                            onChangeText={(text) => handleChange('number', text)}
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email address"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={confirmSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        margin: 15,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    formGroup: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flex: {
        flex: 1,
    },
    leftMargin: {
        marginLeft: 10,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#2c3e50',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});