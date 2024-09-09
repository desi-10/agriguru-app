import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

const ProduceDetailScreen = () => {
  // Example data
  const produce = {
    name: "Smooth Cayenne",
    description:
      "The most common type, known for its high juice content and sweet flavor.",
    color:
      "The skin is typically yellow-orange when ripe, and the flesh is pale yellow.",
    location: "Ho (Ahoe)",
    availableQuantity: "60 Tons",
    image: "https://example.com/pineapple.png", // Replace with your image URL
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: produce.image }} style={styles.image} />
      <Text style={styles.title}>{produce.name}</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Description: </Text>
        {produce.description}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Color: </Text>
        {produce.color}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Location: </Text>
        {produce.location}
      </Text>
      <View style={styles.availabilityContainer}>
        <Text style={styles.availabilityText}>AVAILABLE</Text>
        <Text style={styles.quantityText}>{produce.availableQuantity}</Text>
      </View>
      <Button
        title="Edit"
        // onPress={() => navigation.navigate("ProduceEdit", { produce })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  availabilityContainer: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: "center",
  },
  availabilityText: {
    color: "white",
    fontWeight: "bold",
  },
  quantityText: {
    color: "white",
    fontSize: 18,
  },
});

export default ProduceDetailScreen;
