"use client";

import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import testBarbers from "../utilities/testing/testBarbers.json";
import testInformation from "../utilities/testing/testShopInformation.json";
import ShopPortal from "../component/shopManagmentComponents/shopPortal";
import BarberPortal from "../component/shopManagmentComponents/barberPortal";

export default function ShopManagmentPage({ navigation }) {
  const [barbers, setBarbers] = useState([]);
  const [shopInfo, setShopInfo] = useState(testInformation.shopInfo);
  const [liftedData, setLiftedData] = useState(null);

  // Sort barbers alphabetically by name
  useEffect(() => {
    const sortedBarbers = [...testBarbers].sort((a, b) => {
      if (a.barber_name < b.barber_name) return -1;
      if (a.barber_name > b.barber_name) return 1;
      return 0;
    });
    setBarbers(sortedBarbers);
  }, [testBarbers]);

  // Update shop info when liftedData changes
  useEffect(() => {
    if (liftedData) {
      setShopInfo((prevShopInfo) => ({
        ...prevShopInfo,
        shopName: liftedData.name,
        shopNumber: liftedData.number,
        shopEmail: liftedData.email,
      }));
    }
  }, [liftedData]);

  // Callback function to handle data from ShopPortal
  const callBack = (data) => {
    setLiftedData(data);
  };

  return (
    <View>
      <View>
        <ShopPortal shopInformation={shopInfo} callBackOnSubmit={callBack} />
      </View>
      <View>
        <BarberPortal barbers={barbers} navigation={navigation} />
      </View>
      <Button
        title="Add Barber"
        onPress={() => navigation.push("Add Barber")}
      />
    </View>
  );
}
