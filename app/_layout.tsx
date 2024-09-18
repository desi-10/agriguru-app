import { Montserrat_400Regular, useFonts } from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { UserProvider } from "@/components/userContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLogin from "@/components/ProtectedLogin";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Montserrat: Montserrat_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ProtectedRoute>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="farmer/(tabs)" />
          <Stack.Screen name="admin/(tabs)" />
        </Stack>
      </ProtectedRoute>
      <ProtectedLogin>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ProtectedLogin>
    </UserProvider>
  );
}
