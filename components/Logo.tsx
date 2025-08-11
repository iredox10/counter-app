
import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const Logo = () => {
  return (
    <View className="flex-row items-center space-x-2.5">
      <Svg width="28" height="28" viewBox="0 0 100 100" fill="none">
        <Path d="M50 5C25.1472 5 5 25.1472 5 50V95H95V50C95 25.1472 74.8528 5 50 5Z" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M50 35C40 25 25 30 25 45C25 60 50 75 50 75C50 75 75 60 75 45C75 30 60 25 50 35Z" fill="#34D399" />
      </Svg>
      <Text className="text-2xl font-bold text-gray-200">Tazkia</Text>
    </View>
  );
};

export default Logo;
