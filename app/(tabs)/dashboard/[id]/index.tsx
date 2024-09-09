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
} from "react-native";
import { Product } from "..";
import { Ionicons } from "@expo/vector-icons";

const ProduceDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [produce, setProduce] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduce = async () => {
      const { data } = await axios.get(
        `https://agriguru.pythonanywhere.com/api/posts/${id}`
      );
      console.log(data);
      setProduce(data);
    };
    fetchProduce();
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <Image source={{ uri: produce?.produce.image }} style={styles.image} />
        <View
          style={[
            produce?.is_sold_out
              ? styles.soldOutContainer
              : styles.availabilityContainer,
            { position: "absolute", top: 10, right: 10 },
          ]}
        >
          <Text style={styles.availabilityText}>
            {produce?.is_sold_out ? (
              <Text>SOLD OUT</Text>
            ) : (
              <Text>AVAILABLE</Text>
            )}
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
        {/* <Link href="/(tabs)/dashboard/ProduceEdit" asChild> */}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(tabs)/dashboard/ProduceEdit",
              params: {
                id: id,
              },
            });
          }}
          style={[
            styles.editButton,
            { backgroundColor: "#4CAF50", marginRight: 10, marginLeft: 10 },
          ]}
        >
          <Ionicons name="pencil" size={15} color="white" />
          <Text style={{ color: "white", marginLeft: 10 }}>Edit</Text>
        </TouchableOpacity>
        {/* </Link> */}

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: "red" }]}
        >
          <Ionicons name="trash-bin" size={15} color="white" />
          <Text style={{ color: "white", marginLeft: 10 }}>Delete</Text>
        </TouchableOpacity>
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
      <Text style={styles.text}>
        <Text></Text>
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
  quantityText: {
    color: "white",
    fontSize: 18,
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
  editButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProduceDetailScreen;
