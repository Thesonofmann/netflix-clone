import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetStartedScreen = () => {
  const navigation = useNavigation();
  const letters = ['N', 'E', 'T', 'F', 'L', 'I', 'X'];
  const [loading, setLoading] = useState(false);

  // Create an array of Animated.Value objects for each letter
  const fadeAnimations = letters.map(() => useRef(new Animated.Value(0)).current);
  const scaleAnimations = letters.map(() => useRef(new Animated.Value(1.5)).current); 

  useEffect(() => {
    // Animate the letters
    const animations = fadeAnimations.map((fadeAnim, index) => {
      return Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimations[index], {
          toValue: 1,
          duration: 300,
          delay: index * 200,
          useNativeDriver: true,
        })
      ]);
    });

    Animated.stagger(200, animations).start(async () => {
      setLoading(true); // Show loading spinner while checking storage

      const email = await AsyncStorage.getItem('userEmail');
      const password = await AsyncStorage.getItem('userPassword');
      setLoading(false);

      if (email && password) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('Onboarding');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {letters.map((letter, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.text,
              { opacity: fadeAnimations[index], transform: [{ scale: scaleAnimations[index] }] }
            ]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  textContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF0000',
    marginHorizontal: 3,
  },
  loadingContainer: {
    position: 'absolute',
    top: '60%',
  },
});

export default GetStartedScreen;
