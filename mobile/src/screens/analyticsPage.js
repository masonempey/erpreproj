import React, {useState, useEffect} from "react";
import {View, Text, Button, Dimensions} from "react-native";
import testPastAppointments from "../utilities/testing/pastAppointments.json";
import testBarbers from "../utilities/testing/testBarbers.json";
import {LineChart} from "react-native-chart-kit";
import {Dropdown} from "react-native-element-dropdown";

export default function AnalyticsPage() {
    const [selectedBarber, setSelectedBarber] = useState("All");
    const [barbers, setBarbers] = useState([]);
    const [barberList, setBarberList] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [dateRange, setDateRange] = useState("All");
    const [filteredType, setFilteredType] = useState("NumApp")
    const [applicableData, setApplicableData] = useState("All");
    
    useEffect(() => {
        const sortedAppointments = [...testPastAppointments].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPastAppointments(sortedAppointments);
        setApplicableData(sortedAppointments);
        const sortedBarbers = [...testBarbers].sort((a, b) => {
            if (a.barber_name < b.barber_name) {
                return -1
            }
            if (a.barber_name > b.barber_name) {
                return 1
            } if (a.barber_name == b.barber_name) {
                return 0
            }
        });
        setBarbers(sortedBarbers);
        
    }, []);

    useEffect(() => {  
        let filteredAppointments = [...pastAppointments];

        if(dateRange === "Year") {
            const year = new Date();
            year.setFullYear(year.getFullYear() -1);
            filteredAppointments = filteredAppointments.filter((appointment) => new Date(appointment.date) >= year);
        } else if (dateRange === "Month") {
            const month = new Date();
            month.setMonth(month.getMonth() -1);
            filteredAppointments = filteredAppointments.filter((appointment) => new Date(appointment.date) >= month);
        }
        setApplicableData(filteredAppointments);
        
    }, [dateRange]);

    useEffect(() => {
        
    }, [applicableData])

    const allTimeSelection = () => {
        setDateRange("All");
    }

    const yearlySelection = () => {
        setDateRange("Year");
    }

    const monthlySelection = () => {
        setDateRange("Month");
    }

    const appNumberSelection = () => {
        setFilteredType("NumApp");
    }

    const reviewsSelection = () => {
        setFilteredType("Reviews");
    }

    return(
        <View>
            <Text>Shop Performance</Text>
            <Dropdown 
            data={barberList}
            onChange={item => {
                setSelectedBarber(item.value);
            }}
            />
            <View>
                <Button title="All Time" onPress={allTimeSelection}/>
                <Button title="Year" onPress={yearlySelection}/>
                <Button title="Month" onPress={monthlySelection}/>
            </View>
            <View>
                <Button title="# Appointments" onPress={appNumberSelection}/>
                <Button title="Reviews" onPress={setFilteredType}/>
            </View>
            {/* react native charts component, coppied hieght and width props https://www.npmjs.com/package/react-native-chart-kit  */}
            <LineChart data={{
                labels: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                datasets:[
                    {
                        data: [
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                        ]      
                    }
                ]
            }}
            width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisSuffix="App"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
            borderRadius: 16
            },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
        }}
        bezier
        style={{
            marginVertical: 8,
            borderRadius: 16
        }} />
        </View>
    )
}