import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { User, useUser } from "@/components/userContext"; // Ensure the correct path for your context
import axios from "axios"; // Or you can use `fetch` if you prefer
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker

const EditProfile = () => {
  const { user, setUser } = useUser();

  const [firstName, setFirstName] = useState<string>(user?.first_name || "");
  const [lastName, setLastName] = useState<string>(user?.last_name || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [address, setAddress] = useState<string>(user?.address || "");
  const [profileImage, setProfileImage] = useState<string>(
    user?.profile_picture || "https://www.w3schools.com/w3images/avatar2.png"
  );

  // Function to handle image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Error",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle image upload
      const { uri } = result.assets[0];
      setProfileImage(uri); // Set preview
    }
  };

  // Function to handle image upload
  const handleSave = async () => {
    try {
      // Prepare the form data for submission
      const formData = new FormData();

      // Append updated fields
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("address", address);

      // Append the profile image if it has changed
      if (profileImage !== user?.profile_picture) {
        formData.append("profile_picture", {
          uri: profileImage,
          name: "profile_image.jpg",
          type: "image/jpeg",
        } as any); // `as any` to bypass TypeScript warning
      }

      // Make PATCH request to update user profile
      const { data } = await axios.patch(
        `https://agriguru.pythonanywhere.com/api/profiles/${user?.user_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the user context with the new profile data
      setUser({
        ...user,
        ...data, // Spread the returned data to update user info
        profile_picture: data?.profile_picture || user?.profile_picture, // Ensure we keep the profile picture updated
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", JSON.stringify(error));
      Alert.alert("Error", "An error occurred while updating your profile.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
