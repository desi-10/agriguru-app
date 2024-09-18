import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useUser } from "@/components/userContext";
import axios from "axios";
import { Link, useRouter } from "expo-router";

interface Farmer {
  id: number;
  first_name: string;
  last_name: string;
  // ... other farmer properties ...
}

interface Produce {
  id: number;
  name: string;
  description: string;
  image: string;
  // ... other produce properties ...
}

export interface Product {
  id: number;
  farmer: Farmer;
  produce: Produce;
  image: string | null;
  location: string;
  description: string;
  expected_quantity: number;
  price_per_ton: number | null;
  expected_harvest_date: string;
  is_sold_out: boolean;
  // ... other product properties ...
}

const DashBoard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://agriguru.pythonanywhere.com/api/posts/",
        {
          params: {
            user_id: user?.user_id,
          },
        }
      );
      setProducts(data); // Assuming data is an array of products
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(
        "https://agriguru.pythonanywhere.com/api/posts/",
        {
          params: {
            user_id: user?.user_id,
          },
        }
      );
      setProducts(data); // Update the product list
    } catch (error) {
      console.error(error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        router.push(`/farmer/(tabs)/dashboard/${item.id}`);
      }}
    >
      <Image
        source={{
          uri: item?.image || "http://via.placeholder.com/150",
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.produce.name}</Text>
        <Text style={styles.productLocation}>{item.location}</Text>
        <Text style={styles.productQuantity}>
          Quantity: {item.expected_quantity}
        </Text>
        <Text style={styles.productPrice}>GH₵ {item.price_per_ton} / ton</Text>
      </View>
    </TouchableOpacity>
  );

  const headerHeight = useHeaderHeight();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E8449" />
        <Text style={styles.loadingText}>Loading Posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            margin: 20,
            textAlign: "center",
            color: "#4CAF50",
          }}
        >
          Manage your posts
        </Text>
        {products?.length === 0 ? (
          <Text style={styles.emptyText}>No Posts found.</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              styles.productList,
              { paddingBottom: headerHeight },
            ]}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListFooterComponent={() => <View style={{ height: 100 }} />}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    position: "relative",
  },
  productList: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    width: "48%",
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  productImage: {
    width: "100%",
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  productInfo: {
    alignItems: "center",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  productLocation: {
    fontSize: 12,
    color: "#666",
  },
  productQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#566573",
    marginBottom: 15,
    textAlign: "center",
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
});

export default DashBoard;
