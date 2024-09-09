import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { Link, router, useRouter } from "expo-router";

const CreateAccountScreen = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    console.log(username);
    console.log(phoneNumber);
    console.log(password);

    try {
      const { data } = await axios.post(
        "https://agriguru.pythonanywhere.com/api/auth/register/",
        {
          username,
          phone_number: phoneNumber,
          password,
          password2: password,
        }
      );
      console.log(data);

      router.push({
        pathname: "/otp",
        params: {
          username: data?.user?.username,
          phone_number: data?.user?.phone_number,
        },
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative leaf at the top */}
      <View style={styles.decorativeTopLeaf} />

      {/* Create Account Header */}
      <Text style={styles.headerText}>Create Account</Text>
      <Text style={styles.subHeaderText}>
        Create an account to start exploring!
      </Text>

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
      />

      {/* Phone number input */}
      <TextInput
        style={styles.input}
        placeholder="Phone No."
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign Up Button */}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Link asChild href="/sign-in">
        <TouchableOpacity>
          <Text style={styles.alreadyAccountText}>Already have an account</Text>
        </TouchableOpacity>
      </Link>

      {/* Or continue with */}
      <Text style={styles.orContinueText}>Or continue with</Text>

      {/* Google and Apple Sign-in buttons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="google" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Decorative leaf at the bottom */}
      <View style={styles.decorativeBottomLeaf} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  decorativeTopLeaf: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: "#4CAF50",
    borderBottomLeftRadius: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    color: "#000",
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  alreadyAccountText: {
    fontSize: 14,
    color: "#4A4A4A",
    textAlign: "center",
    marginBottom: 20,
  },
  orContinueText: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconButton: {
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
  },
  decorativeBottomLeaf: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: "#4CAF50",
    borderTopRightRadius: 100,
  },
});

export default CreateAccountScreen;
