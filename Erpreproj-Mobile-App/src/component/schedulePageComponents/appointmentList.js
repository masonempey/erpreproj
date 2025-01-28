//this component will evenually use its own custom cards, that will be touchable
//opacities that will most likely lead to the customer profile or more appointment
//information.
import React from "react";
import {FlatList} from "react-native"
import UpcomingViewCard from "../landingPageComponents/UpcomingCards";

export default function AppointmentDayView({appointmentDetails, selectedDate}) {
    return(
        <FlatList 
            data={appointmentDetails}
            /*
                https://stackoverflow.com/questions/53655722/react-native-flatlist-conditional-rendering

            */
            renderItem={({item, index}) => {
                let appointmentDate = item.date.substr(0,10);
                let chosenDate = selectedDate.substr(0,10)
                if (appointmentDate === chosenDate) {
                    return(
                        <UpcomingViewCard
                        AppointmentInformation={item}
                        backgroundColor ={index % 2 === 0 ? '#f0f0f0' : '#ffffff'} 
                        />
                    );
                }   
            }}
        />
    );
}