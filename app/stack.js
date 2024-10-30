import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "../Components/CustomTabBar";
import HomePage from "../Screens/HomePage";
import RecordPage from "../Screens/RecordPage";
import SettingsPage from "../Screens/SettingsPage";
import LoginPage from "../Screens/LoginPage";
import { store } from "../store/store";
import AdvancementsPage from "../Screens/AdvancementsPage";
import DataPage from "../Screens/DataPage";
import LandingPage from "../Screens/LandingPage";
import AdminDetailsPage from "../Screens/AdminDetailsPage";
import SubscriptionPage from "../Screens/SubscriptionPage";
import SignupPage from '../Screens/SignupPage'; // Import the SignupPage

 // Add AdminDetailsPage if not already included

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const TabLayout = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomePage" component={HomePage} />
      <Tab.Screen name="DataPage" component={DataPage} />
      <Tab.Screen name="SettingsPage" component={SettingsPage} />
    </Tab.Navigator>
  );
};

// Main stack setup
export function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{ headerShown: false }}
        initialParams={{ role: 'user' }} // Default role, you can change it as needed
      />
      <Stack.Screen
        name="SignupPage" 
        component={SignupPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDetailsPage"
        component={AdminDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubscriptionPage"
        component={SubscriptionPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TabLayout"
        component={TabLayout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecordPage"
        component={RecordPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdvancementsPage"
        component={AdvancementsPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
