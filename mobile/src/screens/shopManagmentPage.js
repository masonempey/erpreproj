import React, {useState, useEffect} from "react";
import {View, Text, Button} from "react-native";
import testBarbers from "../utilities/testing/testBarbers.json";
import testInformation from "../utilities/testing/testShopInformation.json";
import BarberPortal from "../component/shopManagmentComponents/barberPortal";
import ShopPortal from "../component/shopManagmentComponents/shopPortal";

export default function ShopManagmentPage({navigation}) {
    const [barbers, setBarbers] = useState([]);
    const [shopInfo, setShopInfo] = useState(testInformation.shopInfo);
    const [liftedData, setLiftedData] = useState(null);

    useEffect(() => {
        /* https://dev.to/banesag/sorting-arrays-of-strings-in-javascript-2g11#:~:text=In%20JavaScript%20arrays%20have%20a,items%20into%20an%20alphabetical%20order.&text=The%20sort(%20)%20method%20accepts%20an,based%20on%20the%20elements%20values. */
        const sortedBarbers = [...testBarbers].sort((a, b) => {
            if (a.barber_name < b.barber_name) {
                return -1
            }
            if (a.barber_name > b.barber_name) {
                return 1
            } if (a.barber_name == b.barber_name) {
                return 0
            }
        })
        setBarbers(sortedBarbers);
    }, [testBarbers]);
    useEffect(() => {
        if (barbers) {
            console.log(barbers);
        }
    }, [barbers]);
    useEffect(() => {
        if (liftedData) {
            /* https://react.dev/learn/updating-objects-in-state */
            console.log('Updated Lifted Data:', liftedData);
            setShopInfo((prevShopInfo) => ({
                ...prevShopInfo,
                shopName: liftedData.name,
                shopNumber: liftedData.number,
                shopEmail: liftedData.email,
            }));
            console.log(shopInfo);
        }
    }, [liftedData]);

    const callBack = (data) => {
        /* https://stackoverflow.com/questions/74647645/react-state-is-not-updating-and-updates-with-old-data-when-new-one-comes */
        setLiftedData(data);
        console.log('test', liftedData)
    }

    return(
        <View>
            <View>
                <ShopPortal shopInformation={shopInfo} callBackOnSubmit={callBack} />
            </View>
            <View>
                <BarberPortal barbers={barbers}/>
            </View>
            <Button 
                title="Add Barber"
                onPress={() => navigation.push('Add Barber')}
            />
        </View>
    );
}