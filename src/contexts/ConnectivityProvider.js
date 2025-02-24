import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const ConnectivityContext = createContext();

export const ConnectivityProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert("No Internet Connection", "Please check your internet connection.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isConnected }}>
      {children}
    </ConnectivityContext.Provider>
  );
};
