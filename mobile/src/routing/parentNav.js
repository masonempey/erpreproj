import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from '../screens/landingPage';
import LogInPage from '../screens/logInPage';
import SchedulingPage from '../screens/schedulePage';
import AnalyticsPage from '../screens/analyticsPage';
import ProfilePage from '../screens/profilePage';
import ShopManagmentStack from './shopManagmentStack';
import { useAuth0 } from 'react-native-auth0';
import { View, Text } from 'react-native';
import LogoutButton from '../component/sharedComponents/LogoutButton';

const Tab = createBottomTabNavigator();

// Change the NavigationContainer to the root of the app for authentaication process and prevent potential issues
// Ref: https://reactnavigation.org/docs/auth-flow information on how to set up the auth flow
// Ref:https://reactnavigation.org/docs/navigation-container for more information on how to configure the navigation container
function ParentNav() {


    // Get the user and the loading state from the auth0 hook
    // Condition to check if the user is logged in or not
    // Ref: https://github.com/auth0-samples/auth0-react-native-sample/blob/master/00-Login-Expo/App.js#L40 
    const {user, isLoading} = useAuth0();
    const loggedIn = user !== undefined && user !== null;
    
    if (isLoading) {
        return (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    }

    //https://reactnavigation.org/docs/header-buttons for more info on how to configure the header
    // Adding logout button for users to logout in every screen or pages
    if(loggedIn){
        return(
            <Tab.Navigator
                initialRouteName="Home"
            >
                <Tab.Screen 
                    name="Home" 
                    component={LandingPage}
                    options={{headerRight: 
                        () => <LogoutButton/>
                    }}
                />
                <Tab.Screen 
                    name="Schedule"
                    component={SchedulingPage}
                    options={{headerRight: 
                        () => <LogoutButton/>
                    }}
                />
                <Tab.Screen 
                    name="Managment"
                    component={ShopManagmentStack}
                    options={{headerRight: 
                        () => <LogoutButton/>
                    }}
                />
                <Tab.Screen 
                    name="Analytics"
                    component={AnalyticsPage}
                    options={{headerRight: 
                        () => <LogoutButton/>
                    }}
                />
                <Tab.Screen 
                    name="profilePage"
                    component={ProfilePage}
                    options={{headerRight: 
                        () => <LogoutButton/>
                    }}
                />
            </Tab.Navigator>
        );
    }

    // If the user is not logged in or user is undefined or null, users cannot see any content
    // Can only see the Login page
    if(!loggedIn){
        return(
            <Tab.Navigator>
                <Tab.Screen
                    name="Log In" 
                    component={LogInPage} 
                />     
            </Tab.Navigator>
        )
    }
}

export default ParentNav;
