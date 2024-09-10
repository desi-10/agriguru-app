import React from "react";
import { Stack } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function NotificationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
}
