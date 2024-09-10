import React from "react";
import { Stack } from "expo-router";

function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "User Profile" }} />
      <Stack.Screen name="editProfile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="orders" options={{ title: "Orders" }} />
      {/* Add more Stack.Screen components for additional pages if needed */}
    </Stack>
  );
}

export default UserLayout;
