import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useUser } from "@/components/userContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { router, useLocalSearchParams } from "expo-router";

type ProducesType = {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
};

const Edit = () => {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
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

  // Fetch produce details and pre-fill the form
  useEffect(() => {
    const fetchProduces = async () => {
      try {
        const response = await axios.get(
          `https://agriguru.pythonanywhere.com/api/posts/${id}/`
        );
        const data = response.data;

        setLocation(data.location);
        setDescription(data.description);
        setIsNegotiable(data.is_negotiable);
        setExpectedQuantity(data.expected_quantity.toString());
        setPricePerTon(data.price_per_ton.toString());
        setExpectedHarvestDate(new Date(data.expected_harvest_date));
        setIsSoldOut(data.is_sold_out);
        setProduce(data.produce.id.toString());
        setImage(data.photo);
      } catch (error) {
        console.error("Error fetching produce details:", error);
      }
    };
    fetchProduces();
  }, [id]);

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

      if (image && !image.startsWith("http")) {
        const fileUri = image;
        const fileName = fileUri.split("/").pop();
        const fileType = fileName?.split(".").pop();

        formData.append("photo", {
          uri: fileUri,
          name: fileName || "photo",
          type: `image/${fileType}`,
        } as unknown as Blob);
      }

      await axios.put(
        `https://agriguru.pythonanywhere.com/api/posts/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Data updated successfully!");
      router.push("/farmer/dashboard");
    } catch (error) {
      console.error("Error updating the form!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />
      </View>

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

      <View style={styles.sectionSwitch}>
        <Text style={styles.label}>Is Negotiable?</Text>
        <Switch value={isNegotiable} onValueChange={setIsNegotiable} />
      </View>

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

      <View style={styles.sectionSwitch}>
        <Text style={styles.label}>Is Sold Out?</Text>
        <Switch value={isSoldOut} onValueChange={setIsSoldOut} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Produce</Text>
        <RNPickerSelect
          onValueChange={(value) => setProduce(value)}
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
          value={produce}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Updating..." : "Update"}
        </Text>
      </TouchableOpacity>
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
  },
  textarea: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    height: 100,
  },
  imageUpload: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    height: 200,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: "#888",
    fontSize: 16,
  },
  datePickerButton: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 40,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Edit;
