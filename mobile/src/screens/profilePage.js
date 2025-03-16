"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import testBarbers from "../utilities/testing/testBarbers.json";
import fakeUserContext from "../utilities/testing/testUserContext.json";
export default function ProfilePage({ route }) {
  const { barberId } = route.params || {}; // Get the barber ID from the route
  const loggedInBarberId = fakeUserContext?.user?.barber_id || null;
  const [barber, setBarber] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [bio, setBio] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    const barberData = testBarbers || [];
    const selectedBarber = barberData.find(
      (b) => b.barber_id === (barberId || loggedInBarberId)
    );
    if (selectedBarber) {
      setBarber(selectedBarber);
      setBio(selectedBarber.bio || "");
      setServices(selectedBarber.services_offered || []);
      setIsEditable(selectedBarber.barber_id === loggedInBarberId); // Enable editing only for the logged-in barber
    }
  }, [barberId, loggedInBarberId]);

  const handleSave = () => {
    if (barber) {
      const updatedBarber = {
        ...barber,
        bio: bio,
        services_offered: services,
      };
      setBarber(updatedBarber);
      console.log("Updated Barber:", updatedBarber);
    }
  };

  // Handle adding a new service
  const handleAddService = () => {
    const newService = {
      service_id: `S${services.length + 1}`,
      service_name: "",
      price: 0,
      duration_minutes: 0,
    };
    setServices([...services, newService]);
  };

  // Handle updating a service
  const handleUpdateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  // Handle deleting a service
  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  // Render loading state if barber data is not yet available
  if (!barber) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{barber.barber_name}</Text>

        <Text style={styles.label}>Bio:</Text>
        {isEditable ? (
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            multiline
          />
        ) : (
          <Text style={styles.bio}>{bio}</Text>
        )}

        <Text style={styles.label}>Services:</Text>
        {services.map((service, index) => (
          <View key={service.service_id} style={styles.serviceContainer}>
            {isEditable ? (
              <>
                <TextInput
                  style={styles.input}
                  value={service.service_name}
                  onChangeText={(text) =>
                    handleUpdateService(index, "service_name", text)
                  }
                  placeholder="Service Name"
                />
                <TextInput
                  style={styles.input}
                  value={service.price.toString()}
                  onChangeText={(text) =>
                    handleUpdateService(index, "price", parseFloat(text))
                  }
                  placeholder="Price"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  value={service.duration_minutes.toString()}
                  onChangeText={(text) =>
                    handleUpdateService(
                      index,
                      "duration_minutes",
                      parseInt(text)
                    )
                  }
                  placeholder="Duration (minutes)"
                  keyboardType="numeric"
                />
                <Button
                  title="Delete"
                  onPress={() => handleDeleteService(index)}
                />
              </>
            ) : (
              <>
                <Text style={styles.serviceName}>{service.service_name}</Text>
                <Text>Price: ${service.price}</Text>
                <Text>Duration: {service.duration_minutes} minutes</Text>
              </>
            )}
          </View>
        ))}

        {isEditable && (
          <Button title="Add Service" onPress={handleAddService} />
        )}

        {isEditable && <Button title="Save Changes" onPress={handleSave} />}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures the ScrollView expands to fill the available space
    padding: 20,
    paddingBottom: 100, // Add extra padding to avoid overlap with the nav bar
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
  serviceContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
