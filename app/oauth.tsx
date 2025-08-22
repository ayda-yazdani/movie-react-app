import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/services/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';

export default function OAuth() {
  const { refreshAuthState } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("OAuth: Callback received with params:", params);
        
        // Check if we have any OAuth-related parameters
        // Appwrite typically redirects back with success/error indicators
        
        console.log("OAuth: Refreshing auth state...");
        // Refresh the auth state to detect the new session
        await refreshAuthState();
        console.log("OAuth: Auth state refreshed, redirect will happen via index.tsx");
        
      } catch (error) {
        console.log("OAuth: Error handling callback:", error);
        // If there's an error, redirect to auth screens
        router.replace('/(auth)/sign-in');
      }
    };

    handleOAuthCallback();
  }, [params]);

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-white text-lg">Completing sign in...</Text>
    </View>
  );
}