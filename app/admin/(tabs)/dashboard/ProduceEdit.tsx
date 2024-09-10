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
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

const ProduceEditScreen = () => {
  const { id } = useLocalSearchParams();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<Date | null>(
    null
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [farmer, setFarmer] = useState<any>();
  const [produceType, setProduceType] = useState<any>();
  const [image, setImage] = useState("");
  const [isProduceTypeModalVisible, setProduceTypeModalVisible] =
    useState(false);

  const produceTypes = [
    { id: null, label: "Select Produce Type" },
    { id: "1", label: "Produce Type 1" },
    { id: "2", label: "Produce Type 2" },
    // Add more produce types as needed
  ];

  const renderProduceTypeItem = ({
    item,
  }: {
    item: { id: string | null; label: string };
  }) => (
    <TouchableOpacity
      style={styles.produceTypeItem}
      onPress={() => {
        setProduceType({ id: item.id });
        setProduceTypeModalVisible(false);
      }}
    >
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

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
      // Convert the expected harvest date to a valid Date object
      if (data.expected_harvest_date) {
        setExpectedHarvestDate(new Date(data.expected_harvest_date));
      } else {
        setExpectedHarvestDate(null);
      }
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
      expected_harvest_date: expectedHarvestDate
        ? expectedHarvestDate.toISOString().split("T")[0] // format date to 'YYYY-MM-DD'
        : null,
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

  const handleDateConfirm = (date: Date) => {
    setExpectedHarvestDate(date);
    setDatePickerVisibility(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleUploadImage}>
        <Image source={{ uri: image }} style={styles.image} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Expected Quantity"
        value={expectedQuantity}
        onChangeText={setExpectedQuantity}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Price per Ton"
        value={pricePerTon}
        onChangeText={setPricePerTon}
        keyboardType="numeric"
      />

      <View style={styles.switchContainer}>
        <Text>Negotiable</Text>
        <Switch value={isNegotiable} onValueChange={setIsNegotiable} />
      </View>

      <View style={styles.switchContainer}>
        <Text>Sold Out</Text>
        <Switch value={isSoldOut} onValueChange={setIsSoldOut} />
      </View>

      <View style={styles.dateContainer}>
        <Button
          title="Pick Expected Harvest Date"
          onPress={() => setDatePickerVisibility(true)}
        />
        {expectedHarvestDate && (
          <Text style={styles.dateText}>
            {expectedHarvestDate.toDateString()}
          </Text>
        )}
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setProduceTypeModalVisible(true)}
      >
        <Text>
          {produceType?.id
            ? produceTypes.find((pt) => pt.id === produceType.id)?.label
            : "Select Produce Type"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isProduceTypeModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={produceTypes}
              renderItem={renderProduceTypeItem}
              keyExtractor={(item) => item.id?.toString() || "null"}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setProduceTypeModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Produce</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  dateContainer: {
    marginVertical: 12,
  },
  dateText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  selectButton: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
  },
  produceTypeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  updateButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 8,
    backgroundColor: "#28a745",
    borderRadius: 8,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ProduceEditScreen;
