//this is our landing/barber home page, this is the first page the barber will see when they open our app. 
//this page contains things like the very next appointments the barber has, so they can quickly check 
//their schedule.
import React, {useState, useEffect} from "react";
import { View, Text } from "react-native";
import LandingCalendar from "../component/landingPageComponents/Calander";
import testAppointments from "../utilities/testing/testAppointments.json";
import UpcomingView from "../component/landingPageComponents/UpcomingView";

function LandingPage() {
    const [appointments, setAppointments] = useState([]);
    /*
      here we are creating a useEffect, since we dont have dependancies, this will only run once,
      we are using the use effect to sort the appointments before we pass them into the useState.
      the sort function we are using allows us to sort the array by date, i used this stack overflow 
      post: https://stackoverflow.com/questions/43572436/sort-an-array-of-objects-in-react-and-render-them
      to help with this, i found a reply with a really helpful article that might come in handy later 
      because it deals with dynamic sorting which is something we might want to implement on other pages
      of our app: https://dev.to/ramonak/react-how-to-dynamically-sort-an-array-of-objects-using-the-dropdown-with-react-hooks-195p
    */

    
    useEffect(() => {
        const fetchBarberAppointments = async () => {
            try {
                const barberId = "7bc50236-a87a-450e-ae56-d87a42615a63";
                const response = await fetch(`http://localhost:5000/barbers/${barberId}`);
                const appointmentData = await response.json();

                console.log(appointmentData);
                setAppointments(appointmentData);
            } catch (error) {
                console.error(error);
            }
        }




        const dateSortedAppointments = [...testAppointments].sort(
            /* 
                https://www.youtube.com/watch?v=bZ-s5Q5KVn4
                the sort function compares two values, in our case we use the .sort method in 
                tandem with a sorting arrow function, we are converting the values into dates,
                we are then subtracting one date from the other to see if it is larger, smaller or
                equal. the .sort value, uses the -, + or = to then sort through the array and get it
                in order.
            */
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        setAppointments(dateSortedAppointments)
    }, []);

    return(
        <View>
            {/*
                passing in our appointment list as props for our components.
            */}
            <UpcomingView AppointmentData={appointments} />
            <LandingCalendar />
        </View>
    );
}

export default LandingPage;