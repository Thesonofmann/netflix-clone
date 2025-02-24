import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";

// Import screens
import GetStartedScreen from "../Screens/GetStartedScreen"
import LoginScreen from "../Screens/LoginScreen";
import OnboardingCarousel from "../Screens/OnboardingCarousel";
import SignupScreen from "../Screens/SignupScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import Search from "../Screens/Search";
import MovieDetail from "../Screens/MovieDetail";
import MyList from "../Screens/MyList";
import HomeScreen from "../Screens/HomeScreen";
import ComingSoonScreen from "../Screens/ComingSoonScreen";
import MyNetflixScreen from "../Screens/MyNetflixScreen";
import Downloads from "../Screens/Downloads";
import ManageProfileScreen from "../Screens/ManageProfileScreen";

import { ConnectivityContext } from "../contexts/ConnectivityProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#333", borderTopColor: "#444" },
        tabBarLabelStyle: { color: "#fff" },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Coming Soon") {
            iconName = "clock-outline";
          } else if (route.name === "MyNetflix") {
            iconName = "account-circle-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Coming Soon" component={ComingSoonScreen} />
      <Tab.Screen name="MyNetflix" component={MyNetflixScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isConnected } = useContext(ConnectivityContext);

  if (!isConnected) {
    Alert.alert(
      "No Internet Connection",
      "Please check your internet connection."
    );
    return <GetStartedScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingCarousel} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
      <Stack.Screen name="MyList" component={MyList} />
      <Stack.Screen name="Downloads" component={Downloads} />
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="ManageProfile" component={ManageProfileScreen} />
    </Stack.Navigator>
  );
};

const Navigation = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default Navigation;
