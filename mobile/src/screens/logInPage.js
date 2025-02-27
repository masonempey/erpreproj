import React from "react";
import {View,Text} from "react-native";


export default function LogInPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    return(
        <View>
            <Text>This is the login Page</Text>
        </View>
    );
    
}
