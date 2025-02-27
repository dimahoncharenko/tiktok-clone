import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import "./global.css";

import { AuthProvider } from "@/shared/context/AuthProvider";
import { StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarTranslucent: true,
            statusBarBackgroundColor: "transparent",
          }}
        />
        <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="comments"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="camera"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar backgroundColor="transparent" translucent />
    </AuthProvider>
  );
}
