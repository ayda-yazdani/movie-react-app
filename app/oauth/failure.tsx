import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

export default function OAuthFailure() {
  useEffect(() => {
    console.log("OAuth Failure: User cancelled or error occurred");
    Alert.alert(
      "Sign In Cancelled", 
      "Google sign in was cancelled or failed. Please try again.",
      [
        {
          text: "OK",
          onPress: () => router.replace('/(auth)/sign-in')
        }
      ]
    );
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-white text-lg mb-4">Sign in failed</Text>
      <TouchableOpacity
        className="bg-orange-500 px-6 py-3 rounded-lg"
        onPress={() => router.replace('/(auth)/sign-in')}
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}