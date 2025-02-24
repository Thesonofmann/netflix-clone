import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMyList } from "../contexts/MyListContext";
import { useDownloads } from "../contexts/DownloadContext"; // Import the download context

const MovieDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { movieId } = route.params;
  const { myList, addToMyList } = useMyList(); // Access myList from context
  const { addToDownloads } = useDownloads(); // Access download function from context
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const TMDB_API_KEY = "f55dd2e477072e110c23bb7e6898129b";
      const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setMovie(result);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleAddToMyList = () => {
    const movieExists = myList.some((item) => item.id === movie.id); // Check for duplicate
    if (movieExists) {
      Alert.alert("Already Added", "This movie is already in your list.");
    } else {
      addToMyList(movie);
      navigation.navigate("MyList");
    }
  };

  const handleDownload = () => {
    const movieExists = myList.some((item) => item.id === movie.id);
    if (movieExists) {
      Alert.alert("Already Downloaded", "This movie is already in your downloads.");
    } else {
      addToDownloads(movie); // Add movie to downloads
      navigation.navigate("Downloads"); // Navigate to Downloads page
    }
  };

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

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.releaseDate}>
          Release Date: {new Date(movie.release_date).toLocaleDateString()}
        </Text>
        <Text style={styles.overviewTitle}>Overview:</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoTitle}>Genres:</Text>
          {movie.genres && movie.genres.map((genre) => (
            <Text key={genre.id} style={styles.genre}>
              {genre.name}
            </Text>
          ))}
        </View>

        <View style={styles.iconContainer}>
          <Pressable onPress={handleAddToMyList} style={styles.iconButton}>
            <MaterialIcons name="playlist-add" size={24} color="white" />
            <Text style={styles.iconText}>Add to My List</Text>
          </Pressable>
          <Pressable onPress={handleDownload} style={styles.iconButton}>
            <MaterialIcons name="file-download" size={24} color="white" />
            <Text style={styles.iconText}>Download</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  poster: {
    marginTop: 18,
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 16,
    color: "gray",
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 12,
    lineHeight: 22,
  },
  additionalInfo: {
    marginTop: 12,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  genre: {
    fontSize: 16,
    color: "lightblue",
    marginRight: 8,
    marginBottom: 4,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 40,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default MovieDetail;
