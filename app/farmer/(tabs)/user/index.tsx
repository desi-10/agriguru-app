import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "@/components/userContext";
import axios from "axios";

const UserComponent = () => {
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await AsyncStorage.clear();
    setModalVisible(false);
    router.dismissAll();
    router.replace("/");
  };

  const [refreshing, setRefreshing] = useState(false);
  const [fetchProfile, setFetchProfile] = useState("");
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(
        `https://agriguru.pythonanywhere.com/api/profiles/${user?.user_id}/`
      );

      console.log("Profile refreshed:", JSON.stringify(data));
      setFetchProfile(data?.profile_picture || "");
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setRefreshing(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                fetchProfile ||
                `https://agriguru.pythonanywhere.com${user?.profile_picture}` ||
                "https://www.w3schools.com/w3images/avatar2.png",
            }}
            style={styles.profileImage}
          />
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={styles.username}>{user?.first_name}</Text>
            <Text style={styles.username}>{user?.last_name}</Text>
          </View>
          <Text>{user?.phone_number || "No phone number"}</Text>
          <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
          <Text style={styles.userEmail}>{user?.role || "No role"}</Text>
          <Text style={styles.userEmail}>{user?.address || "No address"}</Text>
        </View>

        <View style={styles.profileOptions}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/farmer/(tabs)/user/editProfile")}
          >
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to sign out?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleSignOut}
                >
                  <Text style={styles.buttonText}>Sign Out</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default UserComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileHeader: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  profileOptions: {
    marginTop: 20,
  },
  optionItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  signOutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#ccc",
  },
  buttonConfirm: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
