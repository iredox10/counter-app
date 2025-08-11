
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Logo from './Logo';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return 'Good Morning';
      if (currentHour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <View className="p-4 sm:p-6 flex-row justify-between items-center shrink-0">
      <Logo />
      <View className="flex-row items-center space-x-3">
        <View className="text-right hidden sm:block">
          <Text className="text-sm font-medium text-gray-300">{greeting}</Text>
          <Text className="text-xs text-gray-500">Peace for your soul</Text>
        </View>
        <View className="p-2.5 bg-[#1E1E1E] rounded-full border border-gray-700">
          <Ionicons name="person" size={20} color="gray" />
        </View>
      </View>
    </View>
  );
};

export default Header;
