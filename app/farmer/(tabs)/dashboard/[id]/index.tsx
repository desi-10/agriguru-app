import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Product } from "..";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/components/userContext";

const ProduceDetailScreen = () => {
  const { user } = useUser();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [produce, setProduce] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduce = async () => {
      const { data } = await axios.get(
        `https://agriguru.pythonanywhere.com/api/posts/${id}`
      );
      setProduce(data);
    };
    fetchProduce();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `https://agriguru.pythonanywhere.com/api/posts/${id}/`
      );
      setIsDeleting(false);
      setModalVisible(false);
      Alert.alert("Success", "Produce deleted successfully");
      router.push("/farmer/(tabs)/dashboard");
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("Error", "Failed to delete produce");
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this produce? This action cannot
              be undone.
            </Text>
            {isDeleting ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "gray" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "red" }]}
                  onPress={handleDelete}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: produce?.image || "https://via.placeholder.com/300" }}
          style={styles.image}
        />
        <View
          style={[
            produce?.is_sold_out
              ? styles.soldOutContainer
              : styles.availabilityContainer,
            { position: "absolute", top: 10, right: 10 },
          ]}
        >
          <Text style={styles.availabilityText}>
            {produce?.is_sold_out ? "SOLD OUT" : "AVAILABLE"}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        {produce?.farmer.id === user?.farmer_id && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/farmer/(tabs)/dashboard/ProduceEdit",
                params: {
                  id: id,
                },
              });
            }}
            style={[
              styles.editButton,
              { backgroundColor: "#4CAF50", marginRight: 10 },
            ]}
          >
            <Ionicons name="pencil" size={15} color="white" />
            <Text style={{ color: "white", marginLeft: 10 }}>Edit</Text>
          </TouchableOpacity>
        )}
        {produce?.farmer.id === user?.farmer_id && (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: "red" }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="trash-bin" size={15} color="white" />
            <Text style={{ color: "white", marginLeft: 10 }}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{produce?.produce.name}</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Description: </Text>
        {produce?.description}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Location: </Text>
        {produce?.location}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Expected Quantity: </Text>
        {produce?.expected_quantity}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Harvest Date: </Text>
        {produce?.expected_harvest_date}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
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
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  availabilityText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  soldOutContainer: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "gray",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProduceDetailScreen;
