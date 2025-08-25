import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import React from 'react';
import { useAuth } from '../../services/AuthContext';

const Profile = () => {
  const { user, userProfile, signout } = useAuth();

  console.log("Profile: User state:", { 
    user: !!user, 
    email: user?.email, 
    profile: !!userProfile,
    profileName: userProfile?.name,
    hasAvatar: !!userProfile?.avatar,
    avatarUrl: userProfile?.avatar
  });

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
      {/* Profile Avatar */}
      {userProfile?.avatar ? (
        <Image 
          source={{ uri: userProfile.avatar }} 
          className="w-24 h-24 rounded-full mb-6"
          style={{ borderWidth: 3, borderColor: '#6B7280' }}
          onError={(error) => console.log("Profile: Image load error:", error.nativeEvent.error)}
          onLoad={() => console.log("Profile: Image loaded successfully")}
        />
      ) : (
        <View className="w-24 h-24 rounded-full bg-secondary mb-6 items-center justify-center">
          <Text className="text-primary text-2xl font-psemibold">
            {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
      )}

      {/* Greeting */}
      <Text className="text-white text-2xl font-psemibold mb-2">
        Hi {userProfile?.name || 'there'}!
      </Text>
      
      <Text className="text-gray-100 text-lg mb-8 text-center">
        {userProfile?.email || user?.email || 'No email available'}
      </Text>
      
      <Text className="text-gray-400 text-sm mb-8">
        Auth Status: {user ? 'Logged In' : 'Logged Out'}
      </Text>
      
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full bg-red-500 rounded-xl min-h-[62px] justify-center items-center"
      >
        <Text className="text-white font-psemibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;