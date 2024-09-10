import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Add = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(new Date());
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [farmer, setFarmer] = useState("");
  const [produce, setProduce] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result?.assets[0]?.uri);
    }
  };

  const handleSubmit = () => {
    const formData = {
      location,
      description,
      is_negotiable: isNegotiable,
      expected_quantity: parseInt(expectedQuantity),
      price_per_ton: parseFloat(pricePerTon),
      expected_harvest_date: expectedHarvestDate,
      is_sold_out: isSoldOut,
      farmer: parseInt(farmer),
      produce: produce,
      image: image,
    };

    axios
      .post("YOUR_BACKEND_ENDPOINT", formData)
      .then((response) => {
        alert("Data submitted successfully!");
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Upload Image</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Pick an image</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Location Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Is Negotiable Switch */}
        <View style={styles.sectionSwitch}>
          <Text style={styles.label}>Is Negotiable?</Text>
          <Switch value={isNegotiable} onValueChange={setIsNegotiable} />
        </View>

        {/* Expected Quantity Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Expected Quantity (Tons)</Text>
          <TextInput
            style={styles.input}
            value={expectedQuantity}
            onChangeText={setExpectedQuantity}
            placeholder="Enter expected quantity"
            keyboardType="numeric"
          />
        </View>

        {/* Price Per Ton Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Price per Ton (GHC)</Text>
          <TextInput
            style={styles.input}
            value={pricePerTon}
            onChangeText={setPricePerTon}
            placeholder="Enter price per ton"
            keyboardType="numeric"
          />
        </View>

        {/* Expected Harvest Date (DatePicker can be used later) */}
        <View style={styles.section}>
          <Text style={styles.label}>Expected Harvest Date</Text>
          <TextInput
            style={styles.input}
            value={expectedHarvestDate.toDateString()}
            editable={false}
          />
        </View>

        {/* Is Sold Out Switch */}
        <View style={styles.sectionSwitch}>
          <Text style={styles.label}>Is Sold Out?</Text>
          <Switch value={isSoldOut} onValueChange={setIsSoldOut} />
        </View>

        {/* Produce Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Produce</Text>
          {/* Produce picker here */}
          <TextInput
            style={styles.input}
            value={produce ? produce : ""}
            placeholder="Enter produce (e.g. Maize)"
            onChangeText={(val) => setProduce(val)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: "#888",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Add;
