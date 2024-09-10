import React, { useEffect, useState } from "react";
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
import { useUser } from "@/components/userContext";
import { Picker } from "@react-native-picker/picker";

type ProducesType = {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
};

const Add = () => {
  const { user } = useUser();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(new Date());
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [produce, setProduce] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [produces, setProduces] = useState<ProducesType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduce = async () => {
      const response = await axios.get(
        "https://agriguru.pythonanywhere.com/api/produces/"
      );
      setProduces(response.data);
    };
    fetchProduce();
  }, []);

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
    setLoading(true);
    try {
      const formData = {
        location,
        description,
        is_negotiable: isNegotiable,
        expected_quantity: parseInt(expectedQuantity),
        price_per_ton: parseFloat(pricePerTon),
        expected_harvest_date: expectedHarvestDate,
        is_sold_out: isSoldOut,
        farmer: user?.farmer_id,
        produce: produce || 1,
        image: image,
      };

      axios
        .post("https://agriguru.pythonanywhere.com/api/posts/", formData)
        .then((response) => {
          alert("Data submitted successfully!");
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
      setLoading(false);

      setLocation("");
      setDescription("");
      setIsNegotiable(false);
      setExpectedQuantity("");
      setPricePerTon("");
      setExpectedHarvestDate(new Date());
      setIsSoldOut(false);
      setProduce("");
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      setLoading(false);
    }
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

        <View style={styles.section}>
          <Text style={styles.label}>Produce</Text>
          <Picker
            selectedValue={produce}
            style={styles.picker}
            onValueChange={(itemValue) => setProduce(itemValue)}
          >
            {produces?.map((item) => (
              <Picker.Item key={item?.id} label={item?.name} value={item.id} />
            ))}
          </Picker>

          {/* Optionally display selected value */}
          {produce && (
            <Text style={styles.selectedText}>Selected Produce: {produce}</Text>
          )}
        </View>
        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
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
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: "#34495E",
  },
});

export default Add;
