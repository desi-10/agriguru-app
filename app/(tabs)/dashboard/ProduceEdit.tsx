import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ProduceEditScreen = () => {
  const { id } = useLocalSearchParams();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [farmer, setFarmer] = useState<any>();
  const [produceType, setProduceType] = useState<any>();
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchProduce = async () => {
      const { data } = await axios.get(
        `https://agriguru.pythonanywhere.com/api/posts/${id}`
      );
      setImage(data.image);
      setLocation(data.location);
      setDescription(data.description);
      setIsNegotiable(data.is_negotiable);
      setExpectedQuantity(data.expected_quantity);
      setPricePerTon(data.price_per_ton);
      setExpectedHarvestDate(data.expected_harvest_date);
      setIsSoldOut(data.is_sold_out);
      setFarmer(data.farmer);
      setProduceType(data.produce);
    };
    fetchProduce();
  }, [id]);

  const handleUpdate = () => {
    const formData = {
      location,
      description,
      is_negotiable: isNegotiable,
      expected_quantity: parseInt(expectedQuantity),
      price_per_ton: parseFloat(pricePerTon),
      expected_harvest_date: expectedHarvestDate,
      is_sold_out: isSoldOut,
      farmer: parseInt(farmer?.id),
      produce: produceType?.id,
    };

    axios
      .patch(`https://agriguru.pythonanywhere.com/api/posts/${id}/`, formData)
      .then(() => {
        Alert.alert("Success", "Data updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating the form!", error);
        Alert.alert("Error", "There was an issue updating the data.");
      });
  };

  const handleUploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Implement the actual image upload to your server here
      console.log("Image selected:", result.assets[0].uri);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setExpectedHarvestDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      <Text>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      <Text>Is Negotiable</Text>
      <Switch value={isNegotiable} onValueChange={setIsNegotiable} />

      <Text>Expected Quantity (Tons)</Text>
      <TextInput
        style={styles.input}
        value={expectedQuantity}
        onChangeText={setExpectedQuantity}
        placeholder="Enter expected quantity"
        keyboardType="numeric"
      />

      <Text>Price per Ton (GHC)</Text>
      <TextInput
        style={styles.input}
        value={pricePerTon}
        onChangeText={setPricePerTon}
        placeholder="Enter price per ton"
        keyboardType="numeric"
      />

      <Text>Expected Harvest Date</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {expectedHarvestDate.toDateString()}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Text>Is Sold Out</Text>
      <Switch value={isSoldOut} onValueChange={setIsSoldOut} />

      <Text>Produce Type</Text>
      <Picker
        selectedValue={produceType}
        style={styles.input}
        onValueChange={(itemValue) => setProduceType(itemValue)}
      >
        <Picker.Item label="Select produce" value="" />
        <Picker.Item label="Maize" value="1" />
        <Picker.Item label="Rice" value="2" />
        <Picker.Item label="Tomatoes" value="3" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#e7e7e7",
    borderRadius: 5,
    marginBottom: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  image: {
    borderRadius: 10,
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});

export default ProduceEditScreen;
