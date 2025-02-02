import React from "react";
import {View,Text} from "react-native";
import { useAuth0 } from "react-native-auth0";
import LoginButton from "../component/loginScreenComponents/LoginButton";


function LogInPage() {
    // Get the user and the loading state from the auth0 hook
    const {user, isLoading} = useAuth0();

    // Condition to check if the user is logged in or not
    // Ref: https://github.com/auth0-samples/auth0-react-native-sample/blob/master/00-Login-Expo/App.js#L40 
    const loggedIn = user !== undefined && user !== null;

    //if the user is still loading, show a loading message
    //Prevent the user from seeing the content of the app while loading and potential issues
    if (isLoading) {
        return (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    }
    
    //if the user is not logged in or user is undefined or null, users cannot see any content
    if(!loggedIn){
        return(
            <View>
                <Text>
                    PLEASE LOGIN TO SEE THE CONTENT:
                </Text>
                <LoginButton/>
            </View>
        )
    }
}

export default LogInPage;