import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TargetReachedModal = ({ isVisible, onContinue, onNew, zikrName }) => {
  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onContinue}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 p-4">
        <View className="bg-[#1E1E1E] border border-green-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">
          <View className="flex items-center mb-4">
            <Ionicons name="trophy-outline" size={48} color="#34D399" />
          </View>
          <Text className="text-xl font-bold mb-2 text-white">Masha'Allah!</Text>
          <Text className="text-gray-400 mb-6 text-center">You have completed your target for {zikrName}. What would you like to do next?</Text>
          <View className="flex-col space-y-3">
            <TouchableOpacity onPress={onContinue} className="w-full px-4 py-3 bg-[#374151] font-semibold rounded-xl">
              <Text className="text-white">Continue Counting</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNew} className="w-full px-4 py-3 bg-green-500 rounded-xl flex-row items-center justify-center">
              <Ionicons name="refresh" size={20} color="black" className="mr-2" />
              <Text className="text-black font-bold">Start New Zikr</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TargetReachedModal;