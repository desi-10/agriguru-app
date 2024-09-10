import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://agriguru.pythonanywhere.com/api/auth/login/",
        {
          phone_number: phoneNumber,
          password: password,
        }
      );

      console.log("Sign-in successful:", data);
      if (Platform.OS === "web") {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(data));
      }
      setLoading(false);
      if (data?.role?.toLowerCase() === "admin") {
        router.replace("/admin/(tabs)/homepage");
      } else {
        router.replace("/farmer/(tabs)/dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.error("Sign-in error:", error);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative leaf at the top */}
      <View style={styles.decorativeTopLeaf} />

      {/* Sign In Header */}
      <Text style={styles.headerText}>Sign In here</Text>
      <Text style={styles.subHeaderText}>Welcome, great to have you back</Text>

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

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>
          {loading ? "Loading..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      {/* Create new account */}
      <Link asChild href="/sign-up">
        <TouchableOpacity>
          <Text style={styles.createAccountText}>Create new account</Text>
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
    left: 0,
    width: 80,
    height: 80,
    backgroundColor: "#4CAF50",
    borderTopRightRadius: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
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
  forgotText: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "right",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  createAccountText: {
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
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: "#4CAF50",
    borderBottomLeftRadius: 100,
  },
});

export default LoginScreen;
