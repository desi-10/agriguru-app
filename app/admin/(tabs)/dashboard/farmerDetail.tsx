import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

type FarmerDetailsProps = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  last_login: string | null;
  role: string;
  phone_number: string;
  address: string | null;
  bio: string | null;
  profile_picture: string | null;
  is_verified: boolean;
  user: number;
};

const FarmerDetail: React.FC<FarmerDetailsProps> = () => {
  const { id } = useLocalSearchParams();

  console.log(id);

  const [farmer, setFarmer] = useState<FarmerDetailsProps | null>(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      const response = await axios.get(
        `https://agriguru.pythonanywhere.com/api/profiles/?user_id=${id}`
      );
      console.log(response.data[0], "farmer");
      setFarmer(response.data[0]);
    };
    fetchFarmer();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri:
              farmer?.profile_picture ||
              "https://www.w3schools.com/w3images/avatar2.png",
          }}
        />
        <Text style={styles.name}>
          {farmer?.first_name || "N/A"} {farmer?.last_name || "N/A"}
        </Text>
        <Text style={styles?.role}>Role: {farmer?.role}</Text>
        {farmer?.is_verified && <Text style={styles.verified}>Verified</Text>}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Email: </Text>
          {farmer?.email || "N/A"}
        </Text>

        <Text style={styles.detailText}>
          <Text style={styles.label}>Phone: </Text>
          {farmer?.phone_number || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Date Joined: </Text>
          {farmer?.date_joined?.split("T")[0]}
        </Text>

        {farmer?.bio && (
          <Text style={styles.detailText}>
            <Text style={styles.label}>Bio: </Text>
            {farmer?.bio}
          </Text>
        )}

        {farmer?.address && (
          <Text style={styles.detailText}>
            <Text style={styles.label}>Address: </Text>
            {farmer?.address}
          </Text>
        )}
      </View>

      {/* onpress should make a call to the farmer */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Linking.openURL(`tel:${farmer?.phone_number}`);
        }}
      >
        <Text style={styles.buttonText}>Contact Farmer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7E9",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E4053",
  },
  role: {
    fontSize: 14,
    color: "#1ABC9C",
  },
  verified: {
    fontSize: 14,
    color: "#27AE60",
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1E8449",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FarmerDetail;
