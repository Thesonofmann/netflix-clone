import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const getLoginDetails = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPassword = await AsyncStorage.getItem('userPassword');
        
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
      } catch (error) {
        console.error("Failed to retrieve login details", error);
      }
    };

    getLoginDetails();
  }, []);

  const handleSignIn = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPassword = await AsyncStorage.getItem('userPassword');
      
      if (email === storedEmail && password === storedPassword) {
        // Navigate to ProfileScreen if credentials match
        navigation.navigate('Profile');
      } else {
        Alert.alert('Login Failed', 'Incorrect email or password');
      }
    } catch (error) {
      console.error("Failed to retrieve login details", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>NETFLIX</Text>
      </View>

      <TextInput
        placeholder="Email or phone number"
        placeholderTextColor="#A0A0A0"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.signInCodeButton}>
        <Text style={styles.signInCodeText}>Use a sign-in code</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpText}>New to Netflix? Sign up now.</Text>
      </TouchableOpacity>

      <Text style={styles.recaptchaText}>
        Sign-in is protected by Google reCAPTCHA to ensure you're not a bot.
        Learn more.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 30,
  },
  logoText: {
    fontSize: 30,
    color: "#E50914",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  input: {
    backgroundColor: "#333333",
    color: "#ffffff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#E50914",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 20,
  },
  signInCodeButton: {
    backgroundColor: "#4A4A4A",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  signInCodeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  recaptchaText: {
    color: "#A0A0A0",
    textAlign: "center",
    fontSize: 12,
  },
});

export default LoginPage;
