import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ onPress, disabled = false }: GoogleSignInButtonProps) {
  const handlePress = () => {
    console.log("GoogleSignInButton: Button pressed, disabled:", disabled);
    if (!disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      className={`
        flex-row items-center justify-center
        bg-white border border-gray-400 rounded-lg
        py-3 px-4 mb-4
        ${disabled ? 'opacity-50' : 'active:bg-gray-50'}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Image
        source={require('@/assets/images/google2.png')}
        className="w-6 h-6 mr-3"
        style={{ objectFit: 'contain' }}
      />
      <Text className="text-gray-800 font-medium text-base">
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}