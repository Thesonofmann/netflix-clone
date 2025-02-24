import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManageProfileScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
    requestPermission();
    loadProfiles(); // Load profiles from local storage when the component mounts
  }, []);

  const loadProfiles = async () => {
    try {
      const storedNames = await AsyncStorage.getItem("profiles_names");
      const storedImages = await AsyncStorage.getItem("profiles_images");

      if (storedNames && storedImages) {
        const names = JSON.parse(storedNames);
        const images = JSON.parse(storedImages);
        const profiles = names.map((name, index) => ({
          name,
          image: images[index] || null,
        }));
        setProfiles(profiles);
      }
    } catch (error) {
      console.error("Failed to load profiles.", error);
    }
  };

  const saveProfiles = async (profilesToSave) => {
    try {
      const names = profilesToSave.map(profile => profile.name);
      const images = profilesToSave.map(profile => profile.image);
  
      await AsyncStorage.setItem("profiles_names", JSON.stringify(names));
      await AsyncStorage.setItem("profiles_images", JSON.stringify(images));
    } catch (error) {
      console.error("Failed to save profiles.", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri); // Set the chosen image
      setIsModalVisible(true); // Open the modal to enter the profile name
    }
  };

  const addOrEditProfile = () => {
    if (newProfileName.trim()) {
      const updatedProfiles = selectedProfile
        ? profiles.map((profile) =>
            profile.name === selectedProfile.name
              ? { name: newProfileName, image: newProfileImage }
              : profile
          )
        : [...profiles, { name: newProfileName, image: newProfileImage }];
      
      setProfiles(updatedProfiles);
      saveProfiles(updatedProfiles);
      resetModal();
    } else {
      Alert.alert("Please enter a name for the profile.");
    }
  };

  const deleteProfile = (profileToDelete) => {
    const updatedProfiles = profiles.filter(profile => profile.name !== profileToDelete.name);
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
  };

  const handleProfilePress = (profile) => {
    if (isEditMode) {
      // Edit mode is active, set selected profile
      setSelectedProfile(profile);
      setNewProfileName(profile.name);
      setNewProfileImage(profile.image);
      setIsModalVisible(true);
    } else {
      // Navigate to HomeTabs with selected profile
      navigation.navigate("HomeTabs", {
        selectedProfileName: profile.name,
      });
    }
  };

  const resetModal = () => {
    setNewProfileName("");
    setNewProfileImage(null);
    setSelectedProfile(null);
    setIsModalVisible(false);
  };

  const changeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri); // Update the chosen image
    }
  };

  const renderProfile = ({ item }) => (
    <TouchableOpacity
      style={styles.profileBox}
      onPress={() => handleProfilePress(item)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.profileImage} />
      )}
      <Text style={styles.profileName}>{item.name}</Text>
      {isEditMode && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteProfile(item)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Manage Profiles</Text>
        <TouchableOpacity
          onPress={() => setIsEditMode(!isEditMode)}
          style={styles.editTextButton}
        >
          <Text style={styles.editText}>{isEditMode ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...profiles, { isAddButton: true }]}
        renderItem={({ item }) =>
          item.isAddButton ? (
            <TouchableOpacity style={styles.addProfileBox} onPress={pickImage}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addProfileText}>Add Profile</Text>
            </TouchableOpacity>
          ) : (
            renderProfile({ item })
          )
        }
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        columnWrapperStyle={styles.row}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={resetModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedProfile ? "Edit Profile" : "Add Profile"}
            </Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={changeImage}
            >
              <Text style={styles.imagePickerText}>
                {selectedProfile && newProfileImage ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity>
            {newProfileImage && (
              <Image
                source={{ uri: newProfileImage }}
                style={styles.previewImage}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Profile Name"
              placeholderTextColor="#888"
              value={newProfileName}
              onChangeText={setNewProfileName}
            />
            <TouchableOpacity
              onPress={addOrEditProfile}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>
                {selectedProfile ? "Save Changes" : "Add Profile"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  editTextButton: {
    padding: 10,
  },
  editText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileBox: {
    width: 130,
    height: 130,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  profileImage: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  profileName: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  deleteText: {
    color: "white",
    fontSize: 12,
  },
  addProfileBox: {
    width: 130,
    height: 130,
    backgroundColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    margin: 10,
  },
  addIcon: {
    fontSize: 40,
    color: "white",
  },
  addProfileText: {
    color: "white",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Darker background with higher opacity
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#222222", // Darker background for the modal content
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "white", // Text color for the modal title
  },
  imagePickerButton: {
    backgroundColor: "#3a8dc4", // Keep button color as is or adjust as needed
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "white", // Text color for the image picker button
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#444444", // Darker border color for input
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#ffffff", // Change text color in input to white
    backgroundColor: "#333333", // Dark background for the input
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "red",
  },
});
