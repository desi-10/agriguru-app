import { useUser } from "@/components/userContext";
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const AgriguruScreen = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo and Top Green Leaf */}
      <View style={styles.topContainer}>
        <Image
          source={{ uri: "https://your-logo-url.png" }} // Replace with your logo URI
          style={styles.logo}
        />
        <Text style={styles.title}>AGRIGURU</Text>
      </View>

      {/* Main Text */}
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>
          Discover Your Potential Industrial Buyer Here
        </Text>
        <Text style={styles.subText}>
          Sustainable practices and partnerships between industries and farmers
          can yield a bountiful harvest for our shared future.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.buttonTextSignUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 50, // Adjust as necessary
    height: 50, // Adjust as necessary
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E8449", // Dark Green color
    marginTop: 10,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1E8449", // Green color
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50,
  },
  signInButton: {
    flex: 1,
    backgroundColor: "#1E8449", // Green color for Sign In
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  signUpButton: {
    flex: 1,
    backgroundColor: "#fff", // White background for Sign Up
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E8449", // Green border color
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text for Sign In
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextSignUp: {
    color: "#1E8449", // Green text for Sign Up
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AgriguruScreen;
