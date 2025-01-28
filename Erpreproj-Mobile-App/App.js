import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import ParentNav from './src/routing/parentNav';
import LogInPage from './src/screens/logInPage';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const expodomain = process.env.EXPO_PUBLIC_DOMAIN;
  const clientauth0Id = process.env.EXPO_PUBLIC_CLIENT_ID;
  
  // Move NavigationContainer to the root of the app for authentication process and prevent potential issues
  return (
    <Auth0Provider domain={expodomain} clientId={clientauth0Id}>
      <NavigationContainer>
        <ParentNav/>
      </NavigationContainer>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
