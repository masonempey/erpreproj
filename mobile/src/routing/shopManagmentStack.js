import React from "react";
import {View, Text} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import ShopManagmentPage from "../screens/shopManagmentPage";
import AddBarberPage from "../screens/addBarberPage";

const Stack = createStackNavigator();

export default function ShopManagmentStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Shop Managment"
                component={ShopManagmentPage}
            />
            <Stack.Screen 
                name="Add Barber"
                component={AddBarberPage}
            />
        </Stack.Navigator>
    )
}