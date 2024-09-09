import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);

  // Replace with your API URL
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "https://agriguru.pythonanywhere.com/api/posts/",
        {
          params: {
            user_id: user?.user_id,
          },
        }
      );
      console.log(data);
      setProducts(data); // Assuming data is an array of products
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    // <Link href={`/dashboard/${item.id}`}>
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        router.push(`/dashboard/${item.id}`);
      }}
    >
      <Image
        source={{
          uri: item.produce.image || "https://example.com/placeholder.jpg",
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
    // </Link>
  );

  const headerHeight = useHeaderHeight();

  return (
    <View style={[styles.container]}>
      <ScrollView>
        {/* Product List */}
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
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
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

        {/* Floating Add Button */}
        <Link asChild href="/dashboard/createPost">
          <TouchableOpacity style={styles.floatingButton}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
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
  productDescription: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
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
  productHarvestDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  addIcon: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 35,
  },
  productPrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default DashBoard;
