import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

import "./global.css";

import { AuthProvider } from "@/shared/context/AuthProvider";
import { AppState } from "@/shared/context/app-state";

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
    <AppState>
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
          <Stack.Screen
            name="(inbox)/followers"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="comments/[id]"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="search"
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
    </AppState>
  );
}
