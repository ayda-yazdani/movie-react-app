import { useEffect } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/services/AuthContext";

export default function Index() {
  const { user, isLoading } = useAuth();

  console.log("Index: Auth state:", { isLoading, hasUser: !!user, userEmail: user?.email });

  if (isLoading) {
    console.log("Index: Still loading, showing loading screen");
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (user) {
    console.log("Index: User authenticated, redirecting to tabs");
    return <Redirect href="/(tabs)" />;
  } else {
    console.log("Index: User not authenticated, redirecting to auth");
    return <Redirect href="/(auth)/sign-up" />;
  }
}