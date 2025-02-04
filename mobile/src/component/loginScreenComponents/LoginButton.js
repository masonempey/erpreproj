import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const LoginButton = () => {
    const { authorize } = useAuth0();
    const expoAudience = process.env.EXPO_PUBLIC_AUDIENCE;
    const expoRedirecturi = process.env.EXPO_PUBLIC_REDIRECT_URI;

    const handleLogin = async () => {
            const response = await authorize({
                scope: 'openid profile email',
                audience: `${expoAudience}`,
                redirectUri: `${expoRedirecturi}`,
            });
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LoginButton;