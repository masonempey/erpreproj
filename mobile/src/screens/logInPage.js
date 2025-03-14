import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, Image, Pressable, Modal, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const LogInPage = () => {
    const backgroundImage = require("../../assets/landing_background.png");
    const logoImage = require("../../assets/logo.png");
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
                    <SafeAreaView style={styles.safeArea}>
                        <Image source={logoImage} resizeMethod="auto" style={styles.logo}></Image>
                        
                        {/* Modal component */}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(!modalVisible)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    {/* Close Button (X) */}
                                    <Pressable
                                        style={styles.buttonClose}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.closeText}>X</Text>
                                    </Pressable>

                                    {/* Input Fields for Email and Password */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email"
                                            placeholderTextColor="#999"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            secureTextEntry={true} // hides the password
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                    
                                    {/* Login Button */}
                                    <Pressable
                                        style={[styles.button, styles.buttonLogin]}
                                        onPress={() => {
                                            // Handle login action
                                        }}
                                    >
                                        <Text style={styles.buttonLoginText}>Login</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>

                        {/* Button to trigger modal */}
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.buttonTextOffModal}>Login</Text>
                        </Pressable>
                    </SafeAreaView>
                </ImageBackground>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center", 
    },
    safeArea: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        maxWidth: 270,
        maxHeight: 100,
        marginBottom: 100,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonOpen: {
        backgroundColor: "#fff",
    },
    buttonClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#e0e0e0",
        alignItems: "center",
        justifyContent: "center",
    },
    closeText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonLogin: {
        backgroundColor: "#35281f",
        marginTop: 15,
    },
    buttonLoginText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonTextOffModal: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 30,
        alignItems: "center",
        position: 'relative', // Needed for absolute positioning of the close button
    },
    inputContainer: {
        width: "100%",
        marginTop: 20,
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        color: "#000",
    },
});

export default LogInPage;