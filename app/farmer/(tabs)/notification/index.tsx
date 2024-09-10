import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import axios from "axios";
import { useUser } from "@/components/userContext";

type Notification = {
  id: number;
  quantity_requested: number;
  produce: string;
  proposed_price: number;
  pickup_date: string;
  expanded: boolean;
  message: string;
  rejected: boolean;
  accepted: boolean;
};

const NotificationsScreen: React.FC = () => {
  const { user } = useUser();
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false);
  const [showIgnoreModal, setShowIgnoreModal] = useState<boolean>(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://agriguru.pythonanywhere.com/api/purchase-request/"
      );
      const filteredData = response.data.filter(
        (notification: Notification) => notification?.accepted === true
      );
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleAccordion = (id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleAccept = async (notification: Notification) => {
    setShowAcceptModal(false);
    try {
      const response = await axios.patch(
        `https://agriguru.pythonanywhere.com/api/purchase-response/${notification.id}/`,
        {
          accepted: true,
          price_per_ton: notification.proposed_price,
          purchase_request: notification.id,
          farmer: user?.farmer_id,
        }
      );
      fetchNotifications();
      console.log("Notification accepted:", response.data);
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  const handleIgnore = async (notification: Notification) => {
    setShowIgnoreModal(false);
    try {
      const response = await axios.patch(
        `https://agriguru.pythonanywhere.com/api/purchase-response/${notification.id}/`,
        {
          rejected: true,
          price_per_ton: 0,
          purchase_request: notification.id,
          farmer: user?.farmer_id,
        }
      );
      console.log("Notification ignored:", response.data);
    } catch (error) {
      console.error("Error ignoring notification:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E8449" />
        <Text style={styles.loadingText}>Loading Notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>No notifications found.</Text>
        ) : (
          data.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleAccordion(notification.id)}
              >
                <Text style={styles.title}>{`We are interested in ${
                  notification.quantity_requested
                } units of type ${
                  notification.produce
                } produce at a proposed price of $${
                  notification.proposed_price
                }, with a pickup date of ${new Date(
                  notification.pickup_date
                ).toLocaleDateString()}.`}</Text>
                <Text style={styles.expandText}>
                  {notification.expanded ? "Collapse" : "Expand"}
                </Text>
              </TouchableOpacity>
              {notification.expanded && (
                <View style={styles.accordionContent}>
                  <Text style={styles.message}>{notification.message}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => {
                        setSelectedNotification(notification);
                        setShowAcceptModal(true);
                      }}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.ignoreButton}
                      onPress={() => {
                        setSelectedNotification(notification);
                        setShowIgnoreModal(true);
                      }}
                    >
                      <Text style={styles.buttonTextIgnore}>Ignore</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Accept Modal */}
      <Modal visible={showAcceptModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Accept</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to accept this request?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() =>
                  selectedNotification && handleAccept(selectedNotification)
                }
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ignoreButton}
                onPress={() => setShowAcceptModal(false)}
              >
                <Text style={styles.buttonTextIgnore}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ignore Modal */}
      <Modal visible={showIgnoreModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Ignore</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to ignore this request?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() =>
                  selectedNotification && handleIgnore(selectedNotification)
                }
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ignoreButton}
                onPress={() => setShowIgnoreModal(false)}
              >
                <Text style={styles.buttonTextIgnore}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#1E8449",
  },
  notificationCard: {
    backgroundColor: "#F8F9F9",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    color: "#566573",
  },
  expandText: {
    fontSize: 14,
    color: "#1E8449",
  },
  accordionContent: {
    marginTop: 10,
  },
  message: {
    fontSize: 12,
    color: "#566573",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#1E8449",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  ignoreButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#E74C3C",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  buttonTextIgnore: {
    color: "#E74C3C",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#566573",
    marginBottom: 15,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default NotificationsScreen;
