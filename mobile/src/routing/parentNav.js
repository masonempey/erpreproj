import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from '../screens/landingPage';
import LogInPage from '../screens/logInPage';
import SchedulingPage from '../screens/schedulePage';
import AnalyticsPage from '../screens/analyticsPage';
import ProfilePage from '../screens/profilePage';
import ShopManagmentStack from './shopManagmentStack';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Change the NavigationContainer to the root of the app for authentaication process and prevent potential issues
// Ref: https://reactnavigation.org/docs/auth-flow information on how to set up the auth flow
// Ref:https://reactnavigation.org/docs/navigation-container for more information on how to configure the navigation container

function TabNavigator(){
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home" component={LandingPage} />
            <Tab.Screen name="Schedule" component={SchedulingPage} />
            <Tab.Screen name="Managment" component={ShopManagmentStack} />
            <Tab.Screen name="Analytics" component={AnalyticsPage} />
            <Tab.Screen name="Profile" component={ProfilePage} />            
        </Tab.Navigator>
    );
}    

function ParentNav() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LogIn" component={LogInPage} />
            <Stack.Screen name="MainApp" component={TabNavigator} />
        </Stack.Navigator>
    );
}

export default ParentNav;
