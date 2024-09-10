import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useUser } from "@/components/userContext";

const ViewOrders = () => {
  const { user } = useUser();
  const orders = user?.orders || [];

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Total: ${item.total}</Text>
      <Text style={styles.orderText}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found.</Text>
        }
      />
    </View>
  );
};

export default ViewOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
