//using a flatlist component to create a scroll view of the items.
//for this component, i took a lot of insparation from my groups mobile dev project in sem 3 since we built something very similar.

import React from "react";
import { FlatList, StyleSheet } from "react-native";
import UpcomingViewCard from "./UpcomingCards";

export default function UpcomingView({AppointmentData}) {
    return(
        <FlatList 
            data={AppointmentData}
            renderItem={({item, index}) => (
                <UpcomingViewCard 
                AppointmentInformation={item} 
                backgroundColor={index % 2 === 0 ? '#f0f0f0' : '#ffffff'} 
                
                /* Got this background color idea from chat gpt, 
                moduluses the index value by two two determine if it 
                is odd or even and uses that to assign a background color */
                
                />
            )}
            keyExtractor={item => item.id}
            style={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        height: 250,
    }
});