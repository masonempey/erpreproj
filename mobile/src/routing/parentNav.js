// ParentNav.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../firebase/firebase-context';
import LandingPage from '../screens/landingPage';
import LogInPage from '../screens/logInPage';
import SchedulingPage from '../screens/schedulePage';
import AnalyticsPage from '../screens/analyticsPage';
import ProfilePage from '../screens/profilePage';
import ShopManagmentStack from './shopManagmentStack';
import { ActivityIndicator, View } from 'react-native';
import LogoutButton from '../component/loginPageComponents/logoutButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{headerRight: () => <LogoutButton />}} >
            <Tab.Screen name="Home" component={LandingPage} />
            <Tab.Screen name="Schedule" component={SchedulingPage} />
            <Tab.Screen name="Managment" component={ShopManagmentStack} />
            <Tab.Screen name="Analytics" component={AnalyticsPage} />
            <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
    );
}

function ParentNav() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="MainApp" component={TabNavigator} />
            ) : (
                <Stack.Screen name="LogIn" component={LogInPage} />
            )}
        </Stack.Navigator>
    );
}

export default ParentNav;