
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfirmationModal = ({ isVisible, icon, color, title, message, confirmText, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 p-4">
        <View className={`bg-[#1E1E1E] border border-${color}-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center`}>
          <View className="flex items-center mb-4">
            <Ionicons name={icon} size={48} color={`${color}-400`} />
          </View>
          <Text className="text-xl font-bold mb-2 text-white">{title}</Text>
          <Text className="text-gray-400 mb-6 text-center">{message}</Text>
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity onPress={onCancel} className="px-8 py-2 bg-[#374151] font-semibold rounded-xl">
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className={`px-8 py-2 bg-${color}-500 rounded-xl`}>
              <Text className="text-black font-bold">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
