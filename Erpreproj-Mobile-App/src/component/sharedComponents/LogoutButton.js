import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { Button } from 'react-native';

const LogoutButton = () => {
    const {clearSession} = useAuth0();

    const handleLogout = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log(e);
        }
    };

    return <Button onPress={handleLogout} title="Log out" />
}

export default LogoutButton;