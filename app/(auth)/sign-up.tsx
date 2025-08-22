import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/services/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, signInWithGoogle, isLoading } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      await signup(email, password, name);
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "An error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message || "An error occurred");
    }
  };

  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-8 text-center">
        Sign Up
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
          <Text className="text-white mb-2">Name</Text>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg"
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

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

        <View>
          <Text className="text-white mb-2">Confirm Password</Text>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg"
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-lg mt-6"
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/sign-in" className="text-orange-500 font-semibold">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}