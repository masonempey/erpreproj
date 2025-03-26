"use client";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import ShopPortal from "../component/shopManagmentComponents/shopPortal";
import BarberPortal from "../component/shopManagmentComponents/barberPortal";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ShopManagementPage({ navigation, route }) {
  const [shopInfo, setShopInfo] = useState({
    shop_name: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    email: ''
  });
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
  const fetchShopInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://10.174.167.208:3000/api/shop");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const shopData = await response.json();
      // Ensure all fields are properly initialized
      setShopInfo({
        shop_name: shopData.shop_name || '',
        address: shopData.address || '',
        city: shopData.city || '',
        province: shopData.province || '',
        postal_code: shopData.postal_code || '',
        phone: shopData.phone || '',
        email: shopData.email || ''
      });
    } catch (error) {
      console.error("Error fetching shop information:", error);
      setError("Failed to load shop information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const handleShopUpdate = async (updatedData) => {
    try {
      setLoading(true);
      console.log("Submitting data:", updatedData);
      
      const dataToSend = {
        ...updatedData,
        phone: updatedData.phone
      };
  
      const response = await fetch("http://10.174.167.208:3000/api/shop", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      console.log("Update response:", response);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Update result:", result);
      
      // First update with the response data
      setShopInfo(prev => ({
        ...prev,
        ...result.updated,
        ...result
      }));
      
      // Then refetch to ensure we have the latest data from server
      await fetchShopInfo();
      
      Alert.alert("Success", "Shop information updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating shop information:", error);
      Alert.alert("Error", error.message || "Failed to update shop information");
      return false;
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchShopInfo}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
      <View style={styles.section}>
        <BarberPortal navigation={navigation} />
      </View>
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