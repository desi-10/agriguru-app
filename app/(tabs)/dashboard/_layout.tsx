import { Link, Stack } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Link href="/(tabs)/dashboard/user">
                <Image
                  source={{
                    uri: "https://github.com/desi-10.png",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    margin: 10,
                  }}
                />
              </Link>
            </View>
          ),
          //navigation button default navigation button
          headerLeft: () => <View></View>,
        }}
      />
      <Stack.Screen name="user" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default DashboardLayout;
