import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

// Create a Context
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start monitoring location changes
      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // meters
          timeInterval: 10000, // milliseconds
        },
        (newLocation) => {
          setUserLocation(newLocation.coords);
          checkLocation(newLocation.coords);
        }
      );

      return () => {
        subscription.remove();
      };
    };

    requestLocationPermissions();
  }, []);

  const checkLocation = (userLocation) => {
    // Mocking the reference location for demonstration
    const referenceLocation = { lat: 0, lon: 0 }; // Replace with your reference location

    // Calculate distance
    const distance = calculateDistance(userLocation, referenceLocation);
    setIsWithinRange(distance <= 5); // Set range to 5 meters

    // Alert if not within range
    if (distance > 5) {
      Alert.alert("Location Error", "You are not within the required range.");
    }
  };

  const calculateDistance = (loc1, loc2) => {
    const R = 6371e3; // Radius of Earth in meters
    const lat1 = loc1.latitude * (Math.PI / 180);
    const lat2 = loc2.lat * (Math.PI / 180);
    const deltaLat = (loc2.lat - loc1.latitude) * (Math.PI / 180);
    const deltaLon = (loc2.lon - loc1.longitude) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  return (
    <LocationContext.Provider value={{ isWithinRange, errorMsg, userLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for using location context
export const useLocation = () => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
