import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// Define the Notification type
type Notification = {
  id: number;
  title: string;
  message: string;
  expanded: boolean;
};

// Sample Data
const notifications: Notification[] = [
  {
    id: 1,
    title: "New Partnership Opportunity",
    message:
      "A buyer is interested in collaborating with your farm to source raw materials.",
    expanded: false,
  },
  {
    id: 2,
    title: "Request for Quotation",
    message:
      "Please provide a quotation for your latest harvest of organic maize.",
    expanded: false,
  },
  {
    id: 3,
    title: "Meeting Invitation",
    message:
      "You have been invited to a meeting with the supply chain team for further negotiations.",
    expanded: false,
  },
];

const NotificationsScreen: React.FC = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data with a timeout
    setTimeout(() => {
      setData(notifications);
      setLoading(false);
    }, 2000); // 2 seconds delay to simulate loading
  }, []);

  const toggleAccordion = (id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleAccept = (id: number) => {
    console.log(`Accepted notification with ID: ${id}`);
  };

  const handleIgnore = (id: number) => {
    console.log(`Ignored notification with ID: ${id}`);
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
      <Text style={styles.header}>Notifications</Text>
      <ScrollView style={styles.scrollView}>
        {data.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion(notification.id)}
            >
              <Text style={styles.title}>{notification.title}</Text>
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
                    onPress={() => handleAccept(notification.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.ignoreButton}
                    onPress={() => handleIgnore(notification.id)}
                  >
                    <Text style={styles.buttonTextIgnore}>Ignore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E8449",
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495E",
  },
  expandText: {
    fontSize: 14,
    color: "#1E8449",
  },
  accordionContent: {
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    color: "#566573",
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#1E8449",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  ignoreButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "#E74C3C",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextIgnore: {
    color: "#E74C3C",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NotificationsScreen;
