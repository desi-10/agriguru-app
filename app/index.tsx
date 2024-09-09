import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const AgriGuruApp = () => {
  return (
    <View style={styles.container}>
      {/* <Image source={require('./agriGuruLogo.png')} style={styles.logo} /> */}
      <Text style={styles.title}>
        Discover Your Potential Industrial Buyer Here
      </Text>
      <Text style={styles.subtitle}>
        Sustainable practices and partnerships between industries and farmers
        can yield a bountiful harvest for our shared future.
      </Text>
      <Link asChild href="/sign-in">
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </Link>
      <Link asChild href="/sign-up">
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AgriGuruApp;
