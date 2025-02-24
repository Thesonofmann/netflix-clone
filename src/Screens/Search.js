import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const Search = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Fetch popular movies on component mount
  useEffect(() => {
    const fetchPopularMovies = async () => {
      const TMDB_API_KEY = "f55dd2e477072e110c23bb7e6898129b"; 
      const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`;

      setLoading(true); // Set loading to true before fetching

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setMovies(result.results || []); // Ensure to set an empty array if no results
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPopularMovies(); // Call the function to fetch movies on mount
  }, []); // Empty dependency array to run only on mount

  const fetchMovies = async () => {
    if (!query.trim()) {
      setMovies([]); // Clear previous results if query is empty
      return;
    }

    const TMDB_API_KEY = "f55dd2e477072e110c23bb7e6898129b"; // Replace with your actual TMDB API key
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

    setLoading(true); // Set loading to true before fetching

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setMovies(result.results || []); // Ensure to set an empty array if no results
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="gray"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text.trim() === "") {
              setMovies([]); // Clear movies when input is empty
            }
          }}
          onSubmitEditing={fetchMovies} // Trigger fetch on Enter
        />
      </View>
      
      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer} // Added style for list container
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieContainer}
              onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })} // Navigate to MovieDetail
            >
              {item.poster_path && ( // Check if poster_path exists
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.poster}
                />
              )}
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    padding: 16,
  },
  backButton: {
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "white",
  },
  listContainer: {
    paddingBottom: 20, // Add padding to the bottom of the list
  },
  movieContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 10, // Add vertical padding for better spacing
    borderBottomWidth: 1, // Add a border for separation
    borderBottomColor: "#333", // Border color
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 16,
  },
  title: {
    color: "white",
    fontSize: 16,
    flex: 1, // Make title flexible to fill available space
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  loadingIndicator: {
    marginVertical: 20, // Margin for spacing
  },
});

export default Search;

