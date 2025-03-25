import React, { useState } from "react";
import { View, TextInput, Text, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function ShopPortal({ shopInformation, callBackOnSubmit }) {
    const [name, setName] = useState(shopInformation.shopName);
    const [number, setNumber] = useState(shopInformation.shopNumber);
    const [email, setEmail] = useState(shopInformation.shopEmail);

    const alertSubmit = () => {
        Alert.alert(
            'Update Shop Information',
            'Are you sure you want to save these changes?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => console.log('Changes cancelled')
                },
                {
                    text: 'Save',
                    onPress: () => handleSubmit()
                },
            ],
            { cancelable: true }
        );
    };

    const handleSubmit = () => {
        const data = { name, number, email };
        callBackOnSubmit(data);
        Alert.alert('Success', 'Your changes have been saved!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Shop Information</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Shop Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter shop name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />
            </View>

            <TouchableOpacity 
                style={styles.button} 
                onPress={alertSubmit}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        margin: 15,
    },
    header: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#2c3e50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});