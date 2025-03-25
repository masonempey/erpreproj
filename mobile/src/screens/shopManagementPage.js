"use client";
import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import testBarbers from "../utilities/testing/testBarbers.json";
import testInformation from "../utilities/testing/testShopInformation.json";
import ShopPortal from "../component/shopManagmentComponents/shopPortal";
import BarberPortal from "../component/shopManagmentComponents/barberPortal";

export default function ShopManagementPage({ navigation }) {
  const [barbers, setBarbers] = useState([]);
  const [shopInfo, setShopInfo] = useState(testInformation.shopInfo);

  // Sort barbers alphabetically by name
  useEffect(() => {
    const sortedBarbers = [...testBarbers].sort((a, b) => {
      if (a.barber_name < b.barber_name) return -1;
      if (a.barber_name > b.barber_name) return 1;
      return 0;
    });
    setBarbers(sortedBarbers);
  }, [testBarbers]);


  useEffect(() => {
    const getShopInfo = async () => {
      try {
        const response = await fetch("http://10.245.24.135:3000/api/shop");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const shopData = await response.json();
        setShopInfo(shopData);
      }
      catch (error) {
        console.error("Error fetching shop information:", error);
      }
    };
    getShopInfo();
  }, []);
  // Callback function to handle data from ShopPortal
  const callBack = (data) => {
    setLiftedData(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ShopPortal shopInformation={shopInfo} callBackOnSubmit={callBack} />
      </View>
      <View style={styles.section}>
        <BarberPortal barbers={barbers} navigation={navigation} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Add Barber"
          onPress={() => navigation.push("Add Barber")}
          color="#007AFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});