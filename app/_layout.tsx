import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/services/AuthContext";
import { Stack, SplashScreen, Redirect } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import './globals.css';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  console.log("RootLayout: Current state:", { isLoading, hasUser: !!user, userEmail: user?.email });

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    console.log("RootLayout: Showing loading screen");
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  console.log("RootLayout: Rendering stack with all screens");

  return (
    <>
      <StatusBar hidden={true} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="movies/[id]" />
        <Stack.Screen name="oauth" />
        <Stack.Screen name="oauth/success" />
        <Stack.Screen name="oauth/failure" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}