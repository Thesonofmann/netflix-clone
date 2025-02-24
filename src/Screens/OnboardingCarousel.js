import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const data = [
  {
    title: 'Stream Anywhere',
    description: 'Watch your favorite movies on any device.',
    logo: require('../assets/Images/phone.png'),
  },
  {
    title: 'Watch Offline',
    description: 'Download and watch anytime, even without internet.',
    logo: require('../assets/Images/pop.png'),
  },
  {
    title: 'Unlimited Movies',
    description: 'Enjoy unlimited access to movies and series.',
    logo: require('../assets/Images/m3.png'),
  },
];

const OnboardingCarousel = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Carousel Content */}
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {data.map((item, index) => (
          <LinearGradient
            key={index}
            colors={['#0a0f24', '#192742']}
            style={styles.slide}
          >
            {/* Each slide's logo */}
            <Image source={item.logo} style={styles.logo} />

            {/* Slide title and description */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Logo and Signup Link positioned absolutely */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Images/net.png')} // Replace with your global logo image path
          style={styles.logoTopLeft}
        />
        <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      {/* Page Indicator */}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index ? styles.activeIndicator : {},
            ]}
          />
        ))}
      </View>

      {/* Skip or Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => 
          navigation.navigate(activeIndex === data.length - 1 ? 'Signup' : 'Signup')
        }
      >
        <Text style={styles.buttonText}>
          {activeIndex === data.length - 1 ? 'Get Started' : 'Skip'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height, // Full screen slide
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200, // Increased size for the logo
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28, // Larger font for the title
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10, // Adjusted spacing
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#d3d3d3',
    textAlign: 'center',
    paddingHorizontal: 20, // Added padding for better text alignment
    marginBottom: 40, // Spacing between text and indicator
  },
  header: {
    position: 'absolute',
    top: 40, // Positioning the header elements
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10, // Ensure it stays above the carousel
  },
  logoTopLeft: {
    width: 50,
    height: 50, // Adjusted size for the logo
    resizeMode: 'contain',
  },
  signupLink: {
    padding: 10,
  },
  signupText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 20,
    position: 'absolute',
    bottom: 150, // Adjust based on your design
    alignSelf: 'center',
  },
  indicator: {
    width: 12, // Increased size for visibility
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginHorizontal: 5,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
  button: {
    backgroundColor: '#E50914',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingCarousel;
