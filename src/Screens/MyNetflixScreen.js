import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { useMyList } from "../contexts/MyListContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const MyNetflixScreen = () => {
  const { myList } = useMyList();
  const navigation = useNavigation();
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState({ image: null, name: "User" });

  const loadProfiles = async () => {
    try {
      const storedNames = await AsyncStorage.getItem("profiles_names");
      const storedImages = await AsyncStorage.getItem("profiles_images");

      if (storedNames && storedImages) {
        const names = JSON.parse(storedNames);
        const images = JSON.parse(storedImages);
        const loadedProfiles = names.map((name, index) => ({
          name,
          image: images[index] || null,
        }));
        setProfiles(loadedProfiles);

        // Set the first profile as the selected profile for now
        if (loadedProfiles.length > 0) {
          setSelectedProfile(loadedProfiles[0]);
          console.log("Profiles Loaded:", loadedProfiles);
        }
      }
    } catch (error) {
      console.error("Failed to load profiles.", error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // Use focus effect to reload profiles when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userName",
        "userEmail",
        "userPassword",
        "userid",
        "profiles",
        "selectedProfile",
      ]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
      Alert.alert("Logged out", "You have been successfully logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleSettingsModal = () => {
    setSettingsModalVisible(!isSettingsModalVisible);
  };

  const navigateToManageProfile = () => {
    toggleSettingsModal(); // Close the modal first
    navigation.navigate("Profile", { isFromMyNetflix: true });

  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section with Title and Settings Icon */}
      <View style={styles.header}>
        <Text style={styles.title}>My Netflix</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={toggleSettingsModal}
        >
          <Icon name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: selectedProfile.image || "https://example.com/default-avatar.png" }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <Text style={styles.profileName}>{selectedProfile.name}</Text>
      </View>

      {/* Notifications and Downloads Section */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
          <Icon name="notifications-outline" size={24} color="#e50914" />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Downloads")}
        >
          <Icon name="download-outline" size={24} color="#3b82f6" />
          <Text style={styles.optionText}>Downloads</Text>
        </TouchableOpacity>
      </View>

      {/* My List Section */}
      <View style={styles.myListSection}>
        <TouchableOpacity onPress={() => navigation.navigate("MyList")}>
          <Text style={styles.sectionTitle}>My List</Text>
        </TouchableOpacity>

        {myList.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            {myList.map((movie) => (
              <Image
                key={movie.id}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
                style={styles.movieThumbnail}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyMessage}>Your list is empty.</Text>
        )}
      </View>

      {/* Settings Modal */}
      <Modal
        isVisible={isSettingsModalVisible}
        onBackdropPress={toggleSettingsModal}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalHeaderText}>Settings</Text>
          <TouchableOpacity style={styles.modalOption} onPress={navigateToManageProfile}>
            <Icon
              name="person-outline"
              size={20}
              color="#fff"
              style={styles.modalOptionIcon}
            />
            <Text style={styles.modalOptionText}>Manage Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handleLogout}>
            <Icon
              name="log-out-outline"
              size={20}
              color="#fff"
              style={styles.modalOptionIcon}
            />
            <Text style={styles.modalOptionText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#444",
    marginBottom: 10, // Space between image and name
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#222",
    width: "100%",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  myListSection: {
    marginVertical: 20,
  },
  scrollContainer: {
    paddingLeft: 10,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  movieThumbnail: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  emptyMessage: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#333",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  modalOptionIcon: {
    marginRight: 10,
  },
  modalOptionText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MyNetflixScreen;
