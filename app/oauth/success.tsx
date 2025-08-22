import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/services/AuthContext';
import { router } from 'expo-router';

export default function OAuthSuccess() {
  const { refreshAuthState } = useAuth();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        console.log("OAuth Success: Refreshing auth state...");
        // Refresh the auth state to detect the new session
        await refreshAuthState();
        console.log("OAuth Success: Auth state refreshed, redirecting to main app");
        // Redirect will happen automatically via the index.tsx logic
      } catch (error) {
        console.log("OAuth Success: Error refreshing auth state:", error);
        // If there's an error, redirect to auth screens
        router.replace('/(auth)/sign-in');
      }
    };

    handleOAuthSuccess();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-white text-lg">Completing sign in...</Text>
    </View>
  );
}