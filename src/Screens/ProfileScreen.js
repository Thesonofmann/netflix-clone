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

export default function ProfileScreen({ navigation, route }) {
  const [profiles, setProfiles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Determine if the back button should be visible
  const isComingFromMyNetflix = route.params?.isFromMyNetflix;

  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
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
      if (editIndex !== null) {
        // Update existing profile
        const updatedProfiles = profiles.map((profile, index) =>
          index === editIndex
            ? { name: newProfileName, image: newProfileImage }
            : profile
        );
        setProfiles(updatedProfiles);
        saveProfiles(updatedProfiles);
      } else {
        // Add new profile
        const newProfile = { name: newProfileName, image: newProfileImage };
        const updatedProfiles = [...profiles, newProfile];
        setProfiles(updatedProfiles);
        saveProfiles(updatedProfiles);
      }
      resetModal();
    } else {
      Alert.alert("Please enter a name for the profile.");
    }
  };

  const deleteProfile = (index) => {
    const updatedProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
  };

  const handleProfilePress = (selectedProfile) => {
    if (isEditMode) {
      // Edit mode is active, open modal for editing
      setEditIndex(profiles.indexOf(selectedProfile));
      setNewProfileName(selectedProfile.name);
      setNewProfileImage(selectedProfile.image);
      setIsModalVisible(true);
    } else {
      // Navigate to HomeTabs with selected profile
      navigation.navigate("HomeTabs", {
        selectedProfileName: selectedProfile.name,
      });
    }
  };

  const resetModal = () => {
    setNewProfileName("");
    setNewProfileImage(null);
    setEditIndex(null);
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

  const renderProfile = ({ item, index }) => (
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
          onPress={() => deleteProfile(index)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isComingFromMyNetflix && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.heading}>Who's Watching?</Text>
        <TouchableOpacity
          onPress={() => setIsEditMode(!isEditMode)}
          style={styles.editTextButton}
        >
          <Text style={styles.editText}>{isEditMode ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...profiles, { isAddButton: true }]}
        renderItem={({ item, index }) =>
          item.isAddButton ? (
            <TouchableOpacity style={styles.addProfileBox} onPress={pickImage}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addProfileText}>Add Profile</Text>
            </TouchableOpacity>
          ) : (
            renderProfile({ item, index })
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
              {editIndex !== null ? "Edit Profile" : "Add Profile"}
            </Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={changeImage}
            >
              <Text style={styles.imagePickerText}>
                {editIndex !== null && newProfileImage
                  ? "Change Image"
                  : "Pick Image"}
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
                {editIndex !== null ? "Save Changes" : "Add Profile"}
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
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  heading: {
    color: "#ffffff",
    fontSize: 24,
  },
  editTextButton: {
    padding: 10,
  },
  editText: {
    color: "#4CAF50",
    fontSize: 16,
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
    borderRadius: 12,
    padding: 2,
  },
  deleteText: {
    color: "white",
    fontSize: 12,
  },
  addProfileBox: {
    width: 130,
    height: 130,
    backgroundColor: "#555555",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  addIcon: {
    color: "white",
    fontSize: 48,
  },
  addProfileText: {
    color: "white",
    marginTop: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#333333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#555555",
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: "#555555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
