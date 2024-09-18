import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/components/userContext";

// Define the Order type based on the structure of your data
type Order = {
  id: number;
  farmer: string;
  order_description: string;
  quantity: number;
  order_status: string;
  order_date: string;
  last_updated: string;
  produce: number;
};

const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://agriguru.pythonanywhere.com/api/orders/",
          {
            params: {
              farmer: user?.farmer_id,
            },
          }
        );
        console.log(data);

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.farmer_id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(
        "https://agriguru.pythonanywhere.com/api/orders/",
        {
          params: {
            farmer_id: user?.farmer_id,
          },
        }
      );

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E8449" />
        <Text style={styles.loadingText}>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
                  <Text
                    style={
                      <Text
                        style={
                          ["pending", "completed", "accepted"].includes(
                            item.order_status
                          )
                            ? styles.pendingStatus
                            : styles.deliveredStatus
                        }
                      >
                        Status: {item.order_status}
                      </Text> ? (
                        styles.pendingStatus
                      ) : (
                        styles.deliveredStatus
                      )
                    }
                  >
                    Status: {item.order_status}
                  </Text>
                </View>
                <Text style={styles.orderDescription}>
                  Description: {item.order_description}
                </Text>
                <Text style={styles.orderQuantity}>
                  Quantity: {item.quantity}
                </Text>

                <Text style={styles.orderDate}>
                  Order Date: {new Date(item.order_date).toLocaleDateString()}
                </Text>
                <Text style={styles.lastUpdated}>
                  Last Updated:{" "}
                  {new Date(item.last_updated).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#1E8449",
  },
  emptyText: {
    fontSize: 16,
    color: "#566573",
    textAlign: "center",
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: "#F8F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderQuantity: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 14,
  },
  pendingStatus: {
    color: "#1E8449",
    fontWeight: "bold",
  },
  deliveredStatus: {
    color: "#E74C3C",
    fontWeight: "bold",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default Orders;
