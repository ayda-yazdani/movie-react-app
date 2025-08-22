import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/services/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, signInWithGoogle, isLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await signin(email, password);
    } catch (error: any) {
      Alert.alert("Sign In Failed", error.message || "An error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Sign-in screen: Google button pressed");
    try {
      console.log("Sign-in screen: Calling signInWithGoogle...");
      await signInWithGoogle();
      console.log("Sign-in screen: signInWithGoogle completed");
    } catch (error: any) {
      console.log("Sign-in screen: Google sign-in error:", error);
      Alert.alert("Google Sign In Failed", error.message || "An error occurred");
    }
  };

  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-8 text-center">
        Sign In
      </Text>

      {/* Google Sign In Button */}
      <GoogleSignInButton 
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      />

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-600" />
        <Text className="text-gray-400 mx-4">or</Text>
        <View className="flex-1 h-px bg-gray-600" />
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-white mb-2">Email</Text>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg"
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-white mb-2">Password</Text>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg"
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-lg mt-6"
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/sign-up" className="text-orange-500 font-semibold">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
}