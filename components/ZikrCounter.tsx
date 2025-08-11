
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ZikrCounter = ({ progress, count, onIncrement, target }) => {
  const CIRCLE_RADIUS = 120;
  const CIRCLE_STROKE_WIDTH = 15;
  const circumference = 2 * Math.PI * (CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <TouchableOpacity onPress={onIncrement} className="relative w-full h-[260px] flex items-center justify-center my-4">
      <Svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 260 260">
        <Circle
          cx="130"
          cy="130"
          r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2}
          fill="transparent"
          stroke="#374151"
          strokeWidth={CIRCLE_STROKE_WIDTH}
        />
        <Circle
          cx="130"
          cy="130"
          r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2}
          fill="transparent"
          stroke="#34D399"
          strokeWidth={CIRCLE_STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="z-10 text-center select-none">
        <Text className="text-7xl font-mono font-bold text-white">{count}</Text>
        <Text className="text-gray-400 text-sm mt-1">TAP TO COUNT</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ZikrCounter;
