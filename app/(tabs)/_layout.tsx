import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@/components/userContext";

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
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"} // Different icons for focused and unfocused state
              color={color}
            />
          ),
        }}
      />

      {/* A default/fallback tab in case role is unknown */}
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="notifications" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
