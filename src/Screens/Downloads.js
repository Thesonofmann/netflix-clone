// src/Screens/Downloads.js
import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDownloads } from "../contexts/DownloadContext";
import Icon from "react-native-vector-icons/MaterialIcons"; // Assuming MaterialIcons for the back button

const Downloads = () => {
  const { downloadedMovies = [] } = useDownloads(); // Set default to an empty array
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Downloads</Text>
      </View>

      {/* Downloaded Movies List */}
      {downloadedMovies.length > 0 ? (
        <FlatList
          data={downloadedMovies}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                }}
                style={styles.poster}
              />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDownloads}>No downloads available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#141414" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    flex: 1,
    marginRight: 32, // Adds space for center alignment with back button
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  poster: { width: 80, height: 120, borderRadius: 8, marginRight: 16 },
  title: { color: "#ffffff", fontSize: 18 },
  noDownloads: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Downloads;
