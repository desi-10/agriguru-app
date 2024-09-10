import React from "react";
import { Stack } from "expo-router";

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Add New Item",
        }}
      />
    </Stack>
  );
}
