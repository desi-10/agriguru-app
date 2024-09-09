import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
} from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

const ProduceEditScreen = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(new Date());
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [farmer, setFarmer] = useState("");
  const [produceType, setProduceType] = useState(null);

  const handleUpdate = () => {
    const formData = {
      location,
      description,
      is_negotiable: isNegotiable,
      expected_quantity: parseInt(expectedQuantity),
      price_per_ton: parseFloat(pricePerTon),
      expected_harvest_date: expectedHarvestDate,
      is_sold_out: isSoldOut,
      farmer: parseInt(farmer),
      produce: produceType,
    };

    axios
      .put(`YOUR_BACKEND_ENDPOINT/${""}`, formData) // Adjust the URL accordingly
      .then((response) => {
        alert("Data updated successfully!");
      })
      .catch((error) => {
        console.error("There was an error updating the form!", error);
      });
  };

  return (
    <View style={styles.container}>
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
      {/* <DateTimePicker
        value={expectedHarvestDate}
        mode="date"
        display="default"
        // onChange={(event, selectedDate) =>
        //   setExpectedHarvestDate(selectedDate || expectedHarvestDate)
        // }
      /> */}

      <Text>Is Sold Out</Text>
      <Switch value={isSoldOut} onValueChange={setIsSoldOut} />

      <Text>Farmer ID</Text>
      <TextInput
        style={styles.input}
        value={farmer}
        onChangeText={setFarmer}
        placeholder="Enter farmer ID"
        keyboardType="numeric"
      />

      <Text>Produce</Text>
      {/* <RNPickerSelect
        // onValueChange={(value) => setProduceType(value)}
        items={[
          { label: "Maize", value: 1 },
          { label: "Rice", value: 2 },
          { label: "Tomatoes", value: 3 },
        ]}
        value={produceType}
      /> */}

      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ProduceEditScreen;
