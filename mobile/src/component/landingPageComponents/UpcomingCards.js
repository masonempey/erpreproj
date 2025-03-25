// UpcomingViewCard component to display the upcoming appointment details
// This component displays the details of the upcoming appointment in a card format
// It uses the TouchableOpacity component from react-native to make the card clickable
// The TouchableOpacity component takes the appointmentInfo as a prop which
// is an object containing the appointment details
// reference: https://reactnative.dev/docs/touchableopacity
// The component also uses the Modal component from react-native to display the appointment details
// in a modal when the card is clicked
// Reference: https://reactnative.dev/docs/modal
// Reference: https://reactnative.dev/docs/linking

import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button, Linking } from "react-native";
import PhoneFilled from "react-native-vector-icons/AntDesign";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UpcomingViewCard({appointmentInfo}) {
    // Convert the date string to a Date object for better formatting and manipulation
    // We use this to display human-readable date/time formats
    var date = new Date(appointmentInfo.date);
    
    // State to control modal visibility
    // When true, the detailed modal view will be shown
    const [modalVisible, setModalVisible] = React.useState(false);

    // Function to handle the phone call when the phone icon is clicked
    // Uses React Native's Linking API to open the phone dialer
    // reference: https://reactnative.dev/docs/linking
    const handleCall = () => {
        const phoneNumber = `tel:${appointmentInfo.guest_phone}`;
        Linking.openURL(phoneNumber).catch(err => console.error("Failed to open phone dialer:", err));
    };

    // Helper component to render consistent detail rows in the modal
    // This reduces code duplication and ensures uniform styling
    const DetailRow = ({label, value}) => (
        <>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}: </Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
            <View style={styles.divider} />
        </>
    );

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}  
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.dateText}>
                            {date.toLocaleDateString()} • {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>
                    
                    <View style={styles.cardBody}>
                        <Text style={styles.nameText}>
                            {appointmentInfo.guest_name}
                        </Text>
                        <View style={styles.phoneRow}>
                            <Text style={styles.phoneText}>
                                {appointmentInfo.guest_phone}
                            </Text>
                            <TouchableOpacity 
                                onPress={(e) => {
                                    e.stopPropagation(); 
                                    handleCall();
                                }}
                                style={styles.phoneIcon}
                            >
                                <PhoneFilled name="phone" size={16} color="#007AFF"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Modal that shows detailed appointment information */}
            <Modal
                animationType="fade" 
                transparent={true}    
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}  
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Appointment Details</Text>
                        
                        {/* Using DetailRow component for consistent field rendering */}
                        <DetailRow label="Date Booked" value={date.toLocaleString()} />
                        <DetailRow label="Guest Name" value={appointmentInfo.guest_name} />
                        <DetailRow label="Guest email" value={appointmentInfo.guest_email} />
                        
                        {/* Special phone number row with call button */}
                        <View style={styles.phoneContainer}>
                            <Text style={styles.detailLabel}>Phone Number: </Text>
                            <Text style={styles.detailValue}>{appointmentInfo.guest_phone}</Text>
                            <TouchableOpacity onPress={handleCall} style={styles.modalCallButton}>
                                <PhoneFilled name="phone" size={20} color="white"/>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Additional appointment details */}
                        <View style={styles.divider} />
                        <DetailRow label="Status" value={appointmentInfo.status} />
                        <DetailRow label="Notes" value={appointmentInfo.notes || "No additional notes"} />
                        
                        {/* Modal close button */}
                        <Button 
                            title="Close" 
                            onPress={() => setModalVisible(false)} 
                            color="#007AFF"  // iOS-style blue button
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 6,  
    },
    card: {
        padding: 16,        
        borderRadius: 12,    
        backgroundColor: "#fff",
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,       
    },
    cardHeader: {
        flexDirection: 'row',      
        justifyContent: 'space-between',  
        alignItems: 'center',       
        marginBottom: 8,           
    },
    dateText: {
        color: '#666',  
        fontSize: 14,
    },
    cardBody: {
        marginTop: 4, 
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',  
        marginBottom: 4,    
    },
    phoneRow: {
        flexDirection: 'row',  
        alignItems: 'center',  
    },
    phoneText: {
        fontSize: 16,
        color: '#444',
        marginRight: 8,  
    },
    phoneIcon: {
        padding: 4,  
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',  
        alignItems: 'center',      
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    modalContent: {
        width: '90%',      
        padding: 20,       
        backgroundColor: '#fff',
        borderRadius: 12, 
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,  
        textAlign: 'center',
        color: '#333',    
    },
    detailRow: {
        flexDirection: 'row',  
        marginVertical: 8,     
    },
    detailLabel: {
        fontWeight: '600',     
        width: 100,         
        color: '#555',     
    },
    detailValue: {
        flex: 1,             
        color: '#333',      
    },
    divider: {
        height: 1,           
        backgroundColor: '#eee',  
        marginVertical: 12,  
    },
    phoneContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 8,   
    },
    modalCallButton: {
        backgroundColor: '#007AFF',  
        padding: 8,                  
        borderRadius: 20,            
        marginLeft: 10,              
    },
});