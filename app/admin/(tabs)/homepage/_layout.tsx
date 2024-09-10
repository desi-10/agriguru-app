import React from "react";
import { Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { Link } from "expo-router";
export default function HomepageLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Homepage",
        }}
      />
    </Stack>
  );
}
