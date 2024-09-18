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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";

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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchProduces = async () => {
      try {
        const response = await axios.get(
          "https://agriguru.pythonanywhere.com/api/produces/"
        );
        console.log(response.data);

        setProduces(response.data);
      } catch (error) {
        console.error("Error fetching produces:", error);
      }
    };
    fetchProduces();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateConfirm = (date: Date) => {
    setExpectedHarvestDate(date);
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate required fields
    if (!location.trim()) {
      alert("Location cannot be blank.");
      setLoading(false);
      return;
    }

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("location", location);
      formData.append("description", description);
      formData.append("is_negotiable", isNegotiable.toString());
      formData.append("expected_quantity", expectedQuantity.toString());
      formData.append("price_per_ton", pricePerTon.toString());
      formData.append(
        "expected_harvest_date",
        expectedHarvestDate.toISOString()
      );
      formData.append("is_sold_out", isSoldOut.toString());
      formData.append("farmer", user?.farmer_id?.toString() || "");
      formData.append("produce", produce.toString() || "1");

      if (image) {
        const filename = image.split("/").pop();
        const type = `image/${filename?.split(".").pop()}`;

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      await axios.post(
        "https://agriguru.pythonanywhere.com/api/posts/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Data submitted successfully!");

      // Reset the form
      setLocation("");
      setDescription("");
      setIsNegotiable(false);
      setExpectedQuantity("");
      setPricePerTon("");
      setExpectedHarvestDate(new Date());
      setIsSoldOut(false);
      setProduce("");
      setImage(null);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Expected Harvest Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Expected Harvest Date</Text>
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {expectedHarvestDate.toDateString()}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={expectedHarvestDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
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
        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          style={{
            inputAndroid: {
              height: 40,
              borderColor: "#ddd",
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 5,
            },
            inputIOS: {
              height: 40,
              borderColor: "#ddd",
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 5,
              fontSize: 16,
              color: "#333",
            },
          }}
          items={produces.map((produce) => ({
            label: produce.name,
            value: produce.id.toString(),
          }))}
        />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  section: {
    marginBottom: 15,
  },
  sectionSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  textarea: {
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    height: 100,
    padding: 10,
  },
  imageUpload: {
    height: 150,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    color: "#888",
  },
  datePickerButton: {
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Add;
