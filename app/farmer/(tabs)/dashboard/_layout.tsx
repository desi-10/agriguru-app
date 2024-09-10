import { Link, Stack } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Posts",
        }}
      />
      <Stack.Screen name="[id]/index" options={{ title: "Post Details" }} />
      <Stack.Screen name="createPost" options={{ title: "Create Post" }} />
      {/* <Stack.Screen name="[id].tsx" options={{ title: "Produce Details" }} /> */}
    </Stack>
  );
}

export default DashboardLayout;
