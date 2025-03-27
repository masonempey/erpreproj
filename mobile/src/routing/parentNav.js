import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../firebase/firebase-context';
import LandingPage from '../screens/landingPage';
import LogInPage from '../screens/logInPage';
import SchedulingPage from '../screens/schedulePage';
// import AnalyticsPage from '../screens/analyticsPage';
import ProfilePage from '../screens/profilePage';
import ShopManagementPage from '../screens/shopManagementPage';
import { ActivityIndicator, View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LogoutButton from '../component/loginPageComponents/logoutButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
    const [managementModalVisible, setManagementModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleManagementPress = () => {
        setManagementModalVisible(true);
    };

    const handleOptionSelect = (option) => {
        setManagementModalVisible(false);
        navigation.navigate('Management', { 
            screen: 'ShopManagement',
            params: { initialView: option }
        });
    };

    return (
        <>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    headerRight: () => <LogoutButton />,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        const iconConfig = {
                            'Home': ['home', 'home-outline'],
                            'Schedule': ['calendar', 'calendar-outline'],
                            'Management': ['business', 'business-outline'],
                            // 'Analytics': ['stats-chart', 'stats-chart-outline'],
                            'Profile': ['person', 'person-outline']
                        };
                        iconName = focused ? iconConfig[route.name][0] : iconConfig[route.name][1];
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={LandingPage} />
                <Tab.Screen
                    name="Schedule"
                    component={SchedulingPage}
                    initialParams={{ selectedDate: new Date().toISOString().split('T')[0] }} 
                />
                <Tab.Screen
                    name="Management"
                    component={ManagementStackScreen}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            handleManagementPress();
                        }
                    }} 
                />
                {/* <Tab.Screen name="Analytics" component={AnalyticsPage} /> */}
                <Tab.Screen name="Profile" component={ProfilePage} />
            </Tab.Navigator>
            
            <Modal
                animationType="fade"
                transparent={true}
                visible={managementModalVisible}
                onRequestClose={() => setManagementModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setManagementModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Management Options</Text>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleOptionSelect('shop')}
                            >
                                <View style={styles.optionContent}>
                                    <Ionicons name="business" size={20} color="#007AFF" style={styles.optionIcon} />
                                    <Text style={styles.optionText}>Shop Management</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleOptionSelect('barber')}
                            >
                                <View style={styles.optionContent}>
                                    <Ionicons name="cut" size={20} color="#007AFF" style={styles.optionIcon} />
                                    <Text style={styles.optionText}>Barber Management</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setManagementModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

function ManagementStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ShopManagement" 
        component={ShopManagementPage}
      />
    </Stack.Navigator>
  );
}

function ParentNav() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="MainApp" component={TabNavigator} />
            ) : (
                <Stack.Screen 
                    name="LogIn" 
                    component={LogInPage} 
                    options={{ gestureEnabled: false }}
                />
            )}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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

export default ParentNav;