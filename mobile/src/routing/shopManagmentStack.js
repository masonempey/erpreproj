import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ShopManagementPage from "../screens/shopManagementPage";

const Stack = createStackNavigator();

export default function ShopManagmentStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2c3e50", // Dark blue header
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        headerTintColor: "#fff", // White back button and title
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: "#f9f9f9", // Light gray background for all screens
        },
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
        transitionSpec: {
          open: {
            animation: "spring",
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: "spring",
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        },
      }}
    >
      <Stack.Screen
        name="Shop Management"
        component={ShopManagementPage}
        options={{ 
          headerShown: false,
          gestureEnabled: false // Disable swipe back on main screen
        }}
      />
     
    </Stack.Navigator>
  );
}