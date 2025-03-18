import React, { useContext } from 'react';
import { Button, View, Text } from 'react-native';
import { AuthContext } from '../../firebase/firebase-context';
import { auth } from '../../firebase/firebase-config';
import { Pressable } from 'react-native';

export default function LogoutButton(){
    const { setUser } = useContext(AuthContext);
    const handleLogout = async () =>{
        try{
            await auth.signOut();
            setUser(null);
        }
        catch (error){
            console.error("Logout Error: ", error);
        }
    };

    return(
        <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: "black", fontSize: 16 }}>Logout</Text>
        </Pressable>       
    );
}