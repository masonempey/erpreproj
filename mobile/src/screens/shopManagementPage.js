"use client";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import testInformation from "../utilities/testing/testShopInformation.json";
import ShopPortal from "../component/shopManagmentComponents/shopPortal";
import BarberPortal from "../component/shopManagmentComponents/barberPortal";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ShopManagementPage({ navigation, route }) {
  const [shopInfo, setShopInfo] = useState(testInformation.shopInfo);
  const [activeView, setActiveView] = useState(route.params?.initialView || 'shop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Handle view changes from route params
  useEffect(() => {
    if (route.params?.initialView) {
      setActiveView(route.params.initialView);
    }
  }, [route.params]);

  // Fetch shop information
  useEffect(() => {
    const fetchShopInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://10.245.24.135:3000/api/shop");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const shopData = await response.json();
        setShopInfo(shopData);
      } catch (error) {
        console.error("Error fetching shop information:", error);
        setError("Failed to load shop information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopInfo();
  }, []);

  const handleShopUpdate = (data) => {
    console.log("Shop data to update:", data);
    Alert.alert("Success", "Shop information updated successfully");
  };

  const handleViewChange = (newView) => {
    setActiveView(newView);
    navigation.setParams({ initialView: newView });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* View Toggle Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            activeView === 'shop' && styles.activeViewButton
          ]}
          onPress={() => handleViewChange('shop')}
        >
          <Ionicons 
            name="business" 
            size={20} 
            color={activeView === 'shop' ? '#fff' : '#007AFF'} 
          />
          <Text style={[
            styles.toggleText,
            activeView === 'shop' && styles.activeToggleText
          ]}>
            Shop Info
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            activeView === 'barber' && styles.activeViewButton
          ]}
          onPress={() => handleViewChange('barber')}
        >
          <Ionicons 
            name="cut" 
            size={20} 
            color={activeView === 'barber' ? '#fff' : '#007AFF'} 
          />
          <Text style={[
            styles.toggleText,
            activeView === 'barber' && styles.activeToggleText
          ]}>
            Barbers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {activeView === 'shop' ? (
        <View style={styles.section}>
          <ShopPortal 
            shopInformation={shopInfo} 
            callBackOnSubmit={handleShopUpdate} 
          />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <BarberPortal 
              barbers={barbers} 
              navigation={navigation} 
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddBarber')}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Barber</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeViewButton: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
  },
  section: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});