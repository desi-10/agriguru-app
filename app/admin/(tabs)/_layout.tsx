import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@/components/userContext";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useUser();

  // Fallback role if the user object is undefined or the role is unknown
  const userRole = user?.role?.toLowerCase() || "guest";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false, // Ensures header doesn't appear on tabs
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          title: "Home",
          headerShown: false, // Prevent header on this screen
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color="#28a745"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Posts",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"}
              color="#28a745"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color="#28a745"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color="#28a745"
            />
          ),
        }}
      />
    </Tabs>
  );
}
