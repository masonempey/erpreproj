import React, { useState } from "react";
import { Modal, TouchableOpacity, Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShopManagementPage from "../screens/shopManagementPage";
import AddBarberPage from "../screens/addBarberPage";

const Stack = createStackNavigator();

export default function ShopManagmentStack({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const showManagementOptions = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    setModalVisible(false);
    navigation.replace('Shop Management', { initialView: option });
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Shop Management"
          component={ShopManagementPage}
          initialParams={{ initialView: 'shop' }}
        />
        <Stack.Screen
          name="Add Barber"
          component={AddBarberPage}
        />
      </Stack.Navigator>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Management Options</Text>
                
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect('shop')}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="business" size={20} color="#007AFF" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Shop Management</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect('barber')}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Ionicons name="cut" size={20} color="#007AFF" style={styles.optionIcon} />
                    <Text style={styles.optionText}>Barber Management</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50'
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50'
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});