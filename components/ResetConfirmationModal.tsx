
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResetConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 p-4">
        <View className="bg-[#1E1E1E] border border-yellow-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">
          <View className="flex items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={48} color="yellow" />
          </View>
          <Text className="text-xl font-bold mb-2 text-white text-center">Reset Counter?</Text>
          <Text className="text-gray-400 mb-6 text-center">Are you sure you want to reset your current count to zero?</Text>
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity onPress={onCancel} className="px-8 py-2 bg-[#374151] font-semibold rounded-xl">
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="px-8 py-2 bg-yellow-500 rounded-xl">
              <Text className="text-black font-bold">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ResetConfirmationModal;
