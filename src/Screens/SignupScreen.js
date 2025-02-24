import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      alert('Account created successfully!');
      navigation.navigate('Profile');
    } catch (error) {
      console.log(error);
      alert('Failed to save data');
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
        placeholder="Name" 
        placeholderTextColor="#A0A0A0" 
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput 
        placeholder="Email" 
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

      <TextInput 
        placeholder="Confirm Password" 
        placeholderTextColor="#A0A0A0" 
        secureTextEntry={true} 
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInLinkText}>Already have an account? Sign in now.</Text>
      </TouchableOpacity>

      <Text style={styles.recaptchaText}>
        This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
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
    color: '#E50914',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#333333',
    color: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#E50914',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInLinkText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  recaptchaText: {
    color: '#A0A0A0',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default SignupScreen;
