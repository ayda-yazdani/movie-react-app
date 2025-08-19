import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useAuth } from '../../services/AuthContext';

const Profile = () => {
  const { user, signout } = useAuth();

  console.log("Profile: User state:", { user: !!user, email: user?.email });

  const handleLogout = async () => {
    try {
      console.log("Profile: Attempting logout...");
      await signout();
      console.log("Profile: Logout successful");
    } catch (error: any) {
      console.log("Profile: Logout error:", error);
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View className="bg-primary flex-1 items-center justify-center px-4">
      <Text className="text-white text-2xl font-psemibold mb-4">
        Profile
      </Text>
      <Text className="text-gray-100 text-lg mb-8">
        Logged in as: {user?.email ?? 'N/A'}
      </Text>
      <Text className="text-gray-400 text-sm mb-8">
        Auth Status: {user ? 'Logged In' : 'Logged Out'}
      </Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full bg-secondary rounded-xl min-h-[62px] justify-center items-center"
      >
        <Text className="text-primary font-psemibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;