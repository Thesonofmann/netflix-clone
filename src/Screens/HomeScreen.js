import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(''); // State to store user name

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.log("Error retrieving user name:", error);
      }
    };

    fetchUserName();
    fetchMoviesByCategory();
  }, []);

  const fetchMoviesByCategory = async () => {
    const TMDB_API_KEY = "f55dd2e477072e110c23bb7e6898129b";
    const categoryIds = [28, 35, 18, 27];

    try {
      const fetchPromises = categoryIds.map((categoryId) =>
        fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${categoryId}&language=en-US&page=1`
        ).then((response) => response.json())
      );

      const results = await Promise.all(fetchPromises);

      const formattedCategories = [
        { title: "Action Movies", data: results[0].results },
        { title: "Comedy Movies", data: results[1].results },
        { title: "Drama Movies", data: results[2].results },
        { title: "Horror Movies", data: results[3].results },
      ];

      setCategories(formattedCategories);
      setError(null);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate("MovieDetail", { movieId });
  };

  const renderMovie = ({ item }) => (
    <Pressable
      onPress={() => handleMoviePress(item.id)}
      style={styles.movieContainer}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.moviePoster}
      />
    </Pressable>
  );

  const renderCategory = (category, index) => (
    <View style={styles.categoryContainer} key={`category-${index}`}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <FlatList
        horizontal
        data={category.data}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // In the HomeScreen component:
return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{`Welcome, ${userName}`}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={styles.searchButton}
        >
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
  
      {/* Featured content and categories */}
      <View style={styles.featuredContainer}>
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/474x/22/d8/2d/22d82d9ecdbeb5c0b2d640f2b2a03f34.jpg",
          }}
          style={styles.featuredImage}
        >
          <View style={styles.featuredOverlay} />
          <Text style={styles.featuredTitle}>JACK AND JOKER</Text>
          <Text style={styles.featuredSubtitle}>
            Gritty • Drama • Mystery • Thriller
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Icon name="play" size={16} color="#000" />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Icon name="add" size={16} color="#000" />
              <Text style={styles.buttonText}>My List</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
  
      {categories.map((category, index) => renderCategory(category, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#141414",
      paddingHorizontal: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#141414",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 16,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginTop: 30,
    },
    searchButton: {
      padding: 10,
      marginTop: 18,
    },
    featuredContainer: {
      alignItems: "center",
      marginBottom: 24,
      position: "relative",
    },
    featuredImage: {
      width: "100%",
      height: 380,
      borderRadius: 10,
      overflow: "hidden",
      justifyContent: "flex-end",
    },
    featuredOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      borderRadius: 10,
    },
    featuredTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      bottom: 80,
      left: 20,
    },
    featuredSubtitle: {
      color: "#fff",
      fontSize: 14,
      textAlign: "center",
      position: "absolute",
      bottom: 60,
      left: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      position: "absolute",
      bottom: 20,
      left: 0,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    buttonText: {
      color: "#000",
      fontWeight: "bold",
      marginLeft: 5,
    },
    categoryContainer: {
      marginBottom: 24,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 12,
    },
    movieContainer: {
      marginRight: 8,
    },
    moviePoster: {
      width: 120,
      height: 180,
      borderRadius: 6,
    },
    errorText: {
      color: "red",
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
    },
  });
  

export default HomeScreen;
