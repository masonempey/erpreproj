import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from '../screens/landingPage';
import LogInPage from '../screens/logInPage';
import SchedulingPage from '../screens/schedulePage';
import AnalyticsPage from '../screens/analyticsPage';
import ProfilePage from '../screens/profilePage';
import ShopManagmentStack from './shopManagmentStack';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Change the NavigationContainer to the root of the app for authentaication process and prevent potential issues
// Ref: https://reactnavigation.org/docs/auth-flow information on how to set up the auth flow
// Ref:https://reactnavigation.org/docs/navigation-container for more information on how to configure the navigation container
function ParentNav() {
        return(
            <Tab.Navigator
                initialRouteName="Home"
            >
                <Tab.Screen 
                    name="Home" 
                    component={LandingPage}
                />
                <Tab.Screen 
                    name="Schedule"
                    component={SchedulingPage}
                />
                <Tab.Screen 
                    name="Managment"
                    component={ShopManagmentStack}
                />
                <Tab.Screen 
                    name="Analytics"
                    component={AnalyticsPage}
                />
                <Tab.Screen 
                    name="profilePage"
                    component={ProfilePage}
                />
            </Tab.Navigator>
        );
    }

export default ParentNav;
