import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    Pressable,
    Modal,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

const LogInPage = () => {
    const backgroundImage = require("../../assets/landing_background.png");
    const logoImage = require("../../assets/logo.png");
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const idToken = await userCredential.user.getIdToken();
            
            const validateRes = await fetch(
                // Cannot use localhost to fetch API from next js for expo
                "http://10.174.167.208:3000/api/users/validate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ uid: userCredential.user.uid }),
                }
            );
            
            setEmail("");
            setPassword("");
            if (!validateRes.ok) {
                const data = await validateRes.json();
                throw new Error(data.error || "User validation failed");
            }

            
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.message?.includes("auth/")
                    ? "Invalid email or password"
                    : error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <ImageBackground
                    source={backgroundImage}
                    resizeMode="cover"
                    style={styles.background}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <Image
                            source={logoImage}
                            resizeMethod="auto"
                            style={styles.logo}
                        />

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

                                    {/* Error Message */}
                                    {error ? (
                                        <Text style={styles.errorText}>{error}</Text>
                                    ) : null}

                                    {/* Input Fields for Email and Password */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder="Email"
                                            placeholderTextColor="#999"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={true}
                                            placeholderTextColor="#999"
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    {/* Login Button */}
                                    <Pressable
                                        style={[styles.button, styles.buttonLogin]}
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text style={styles.buttonLoginText}>Login</Text>
                                        )}
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
        position: "absolute",
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
        position: "relative",
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
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
});

export default LogInPage;