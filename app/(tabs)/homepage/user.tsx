import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const UserComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await AsyncStorage.clear();
    setModalVisible(false);
    router.push("/");
  };

  return (
    <View style={styles.container}>
      {/* Button to trigger modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.openModalButton}
      >
        <Text style={styles.buttonText}>User Options</Text>
      </TouchableOpacity>

      {/* Modal for user options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Android back button handler
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            {/* Close button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>X</Text>
            </Pressable>

            {/* User details */}
            <Text style={styles.modalTitle}>User Settings</Text>
            <Text style={styles.modalText}>Profile: John Doe</Text>
            <Text style={styles.modalText}>Email: john@example.com</Text>

            {/* Sign out button */}
            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openModalButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent backdrop
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  signOutText: {
    color: "white",
    fontSize: 16,
  },
});
