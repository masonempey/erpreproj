//creating the cards or areas that we are going to be using to display the appointment information in
//for the barber page within the flat list.
import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button, Linking } from "react-native";
import PhoneFilled from "react-native-vector-icons/AntDesign";


// UpcomingViewCard component to display the upcoming appointment details
// This component displays the details of the upcoming appointment in a card format
// It uses the TouchableOpacity component from react-native to make the card clickable
// The TouchableOpacity component takes the appointmentInfo as a prop which
//  is an object containing the appointment details
// reference: https://reactnative.dev/docs/touchableopacity
// The component also uses the Modal component from react-native to display the appointment details
// in a modal when the card is clicked
// Reference: https://reactnative.dev/docs/modal
// Reference: https://reactnative.dev/docs/linking
export default function UpcomingViewCard({appointmentInfo}) {

    // Convert the date string to a Date object for better formatting and manipulation 
    var date = new Date(appointmentInfo.date);
    const [modalVisible, setModalVisible] = React.useState(false);

    // Function to handle the phone call when the phone icon is clicked
    // reference: https://reactnative.dev/docs/linking
    const handleCall = () => {
        const phoneNumber = `tel:${appointmentInfo.guest_phone}`;
        Linking.openURL(phoneNumber).catch(err => console.error("Failed to open phone dialer:", err));
    };

    return (
        <View style={[styles.card]}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.card}>
                    <Text>
                        <Text style={styles.label}>Date: </Text>
                        {date.toLocaleString()}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Name: </Text>
                        {appointmentInfo.guest_name}
                    </Text>
                    <Text>
                        <Text style={styles.label}>Phone Number: </Text>
                        {appointmentInfo.guest_phone}

                    </Text>
                </View>
            </TouchableOpacity>


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Appointment Details</Text>
                        
                        <Text>
                            <Text style={styles.label}>Date Booked: </Text>
                            {date.toLocaleString()}
                        </Text>
                        <View style={styles.divider}></View>
                        <Text>
                            <Text style={styles.label}>Guest Name: </Text>
                            {appointmentInfo.guest_name}
                        </Text>
                        <View style={styles.divider}></View>
                        <Text>
                            <Text style={styles.label}>Guest email: </Text>
                            {appointmentInfo.guest_email}
                        </Text>
                        <View style={styles.divider}></View>

                        <View style={styles.phoneContainer}>
                            <Text>
                                <Text style={styles.label}>Phone Number: </Text>
                                {appointmentInfo.guest_phone}
                            </Text>
                            <TouchableOpacity onPress={handleCall} style={styles.callButton}>
                                <Text style={styles.callButtonText}>
                                    <PhoneFilled name="phone" size={20} color="black"/>
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.divider}></View>
                        <Text>
                            <Text style={styles.label}>Status: </Text>
                            {appointmentInfo.status}
                        </Text>
                        <View style={styles.divider}></View>
                        <Text>
                            <Text style={styles.label}>Notes: </Text>
                            {appointmentInfo.notes || "No additional notes"}
                        </Text>
                        <View style={styles.divider}></View>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    phoneContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
   
    },

    callButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#b3b3b3",
        marginVertical: 10,
    },
    card: {
        marginTop: 10,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "rgb(0, 0, 0)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    label: {
        fontWeight: "bold",    
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
})