
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TargetModal = ({ isVisible, onClose, onSave, currentZikr }) => {
  const [localData, setLocalData] = useState(currentZikr);

  useEffect(() => {
    setLocalData(currentZikr);
  }, [currentZikr, isVisible]);

  const handleSave = () => {
    onSave(localData);
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 p-4">
        <View className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-white flex-row items-center">
              <Ionicons name="locate-outline" size={20} color="#34D399" /> Set Your Goal
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="space-y-4">
            <View>
              <Text className="block text-sm font-medium text-gray-400 mb-1">Target Count</Text>
              <TextInput
                keyboardType="numeric"
                value={localData.target.toString()}
                onChangeText={(text) => setLocalData(d => ({ ...d, target: parseInt(text) || 0 }))}
                className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
              />
            </View>
            {/* A proper date picker would be implemented here in a real app */}
            <View>
              <Text className="block text-sm font-medium text-gray-400 mb-1">Deadline</Text>
              <TextInput
                value={localData.deadline}
                onChangeText={(text) => setLocalData(d => ({ ...d, deadline: text }))}
                className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
              />
            </View>
            <View>
              <Text className="block text-sm font-medium text-gray-400 mb-1">Reminder Interval</Text>
              {/* This would be a custom picker component in a real app */}
              <View className="flex-row flex-wrap">
                {[0, 5, 15, 30, 60].map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setLocalData(d => ({ ...d, reminderInterval: value }))}
                    className={`px-3 py-2 rounded-lg m-1 ${localData.reminderInterval === value ? 'bg-[#34D399]' : 'bg-[#374151]'}`}
                  >
                    <Text className={`${localData.reminderInterval === value ? 'text-black' : 'text-white'}`}>
                      {value === 0 ? 'None' : `${value} min`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View className="mt-6">
            <TouchableOpacity onPress={handleSave} className="w-full flex-row items-center justify-center px-4 py-3 bg-[#34D399] font-bold rounded-xl">
              <Ionicons name="checkmark-circle-outline" size={20} color="black" />
              <Text className="text-black ml-2">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TargetModal;
