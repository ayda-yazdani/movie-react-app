import { AuthProvider, useAuth } from "@/services/AuthContext";
import { Stack } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import './globals.css';

function RootLayoutNav() {
  const { user, isLoading} = useAuth()

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar hidden={true} />
      <Stack screenOptions={{ headerShown: false}}>
        {user ? (
          // Authenticated user sees main app
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="movies/[id]" />
          </>
        ): (
          // Unauthenticated user sees auth screens
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
