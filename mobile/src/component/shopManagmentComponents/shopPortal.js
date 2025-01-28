import React, {useState} from "react";
import {View, TextInput, Text, Button, Alert} from "react-native";

export default function ShopPortal({shopInformation, callBackOnSubmit}) {
    const [name, setName] = useState(shopInformation.shopName);
    const [number, setNumber] = useState(shopInformation.shopNumber);
    const [email, setEmail] = useState(shopInformation.shopEmail);

    const alertSubmit = () => {
        /* https://reactnative.dev/docs/alert */
        Alert.alert(
            'Change Shop Credentials?',
            'Are you sure you wish to make this change?',
            [
                {
                    text: 'Cancel',
                    onPress: () => Alert.alert('Changes not saved!')
                },
                {
                    text: 'Save Changes',
                    onPress: () => handleSubmit()
                },
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    Alert.alert('Changes not saved!'),
            }
        )
    }

    const handleSubmit = () => {
        let data = {name, number, email}
        callBackOnSubmit(data);
        Alert.alert('Changes saved!')
    }

    return(
        <View>
            <Text>Shop Information</Text>
            <TextInput placeholder="Shop Name Here" value={name} onChangeText={setName} />
            <TextInput placeholder="Shop Phone Number Here" value={number} onChangeText={setNumber} />
            <TextInput placeholder="Shop Email Here" value={email} onChangeText={setEmail} />
            <Button title="Submit" onPress={alertSubmit} />
        </View>
    );
} 