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
          headerRight: () => (
            <View>
              <Link href="/(tabs)/homepage/user">
                <Image
                  source={{
                    uri: "https://github.com/desi-10.png",
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                  }}
                />
              </Link>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="user"
        options={{ title: "User", presentation: "modal" }}
      />
    </Stack>
  );
}
