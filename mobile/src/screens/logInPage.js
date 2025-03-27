import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    Modal,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

const ip_address = process.env.EXPO_PUBLIC_IP_ADDRESS;

const LogInPage = () => {
    const video = require("../../assets/ErpreVid.mp4");
    const logoImage = require("../../assets/logo.png");
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Use the useVideoPlayer hook to control the video
    const player = useVideoPlayer(video, (player) => {
        player.loop = true; // Loop the video
        player.play(); // Automatically play the video
    });

    // Get screen dimensions
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    // Calculate video height based on aspect ratio (9:16)
    const videoAspectRatio = 9 / 16; // Portrait aspect ratio
    const videoHeight = screenWidth / videoAspectRatio;

    // Function to handle the login process
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
                `${ip_address}:3000/api/users/validate`,
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
                {/* Video Background */}
                <View style={styles.videoContainer}>
                    <VideoView
                        player={player}
                        resizeMode="cover"
                        style={[
                            styles.backgroundVideo,
                            { height: videoHeight, top: (screenHeight - videoHeight) / 2 },
                        ]}
                    />
                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={["rgba(36, 23, 6, 0.6)", "rgba(41, 25, 6, 0.8)"]}
                        style={StyleSheet.absoluteFill} // Covers the entire screen
                    />
                </View>
                {/* Login Components */}
                <SafeAreaView style={styles.safeArea}>
                    <Image
                        source={logoImage}
                        resizeMethod="auto"
                        style={styles.logo}
                    />

                    {/* Modal for Login Form */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                    >
                        <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={styles.buttonClose}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </Pressable>

                            <Text style={styles.formHeader}>Welcome Back</Text>
                            <Text style={styles.formSubheader}>Sign in to your account</Text>

                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email address"
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

                            <Pressable
                                style={[styles.button, styles.buttonLogin]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonLoginText}>Continue</Text>
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
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", 
    },
    videoContainer: {
        flex: 1,
        position: "absolute", 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    inputContainer: {
        width: "100%",
        marginTop: 25,
        marginBottom: 15,
    },
    input: {
        height: 50,
        width: "100%",
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#f8f9fa",
        color: "#333",
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonClose: {
        position: "absolute",
        top: 15,
        right: 15,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    closeText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonLogin: {
        backgroundColor: "#35281f",
        width: "100%",
        paddingVertical: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonLoginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    errorText: {
        color: "#e74c3c",
        fontSize: 14,
        marginBottom: 15,
        textAlign: "center",
        backgroundColor: "#fdecea",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "100%",
    },
    formHeader: {
        fontSize: 22,
        fontWeight: "600",
        color: "#2d3436",
        marginBottom: 5,
    },
    formSubheader: {
        fontSize: 14,
        color: "#636e72",
        marginBottom: 25,
    },
});

export default LogInPage;