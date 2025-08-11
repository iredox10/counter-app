
import React, { useState, useMemo, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, collection, addDoc } from '../config/firebase';
import { AppContext } from '../app/_layout';

const AddCustomZikrModal = ({ isVisible, onClose }) => {
  const { userId } = useContext(AppContext);
  const [newZikrName, setNewZikrName] = useState('');
  const [newZikrTarget, setNewZikrTarget] = useState('100');
  const [error, setError] = useState('');

  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/default-zikr-app/users/${userId}/custom_zikr` : null, [userId]);

  const handleAddCustomZikr = async () => {
    if (!newZikrName.trim()) {
      setError('Please enter a name for the Zikr.');
      return;
    }
    const target = parseInt(newZikrTarget, 10);
    if (isNaN(target) || target <= 0) {
      setError('Target must be a number greater than zero.');
      return;
    }

    if (!customZikrCollectionPath) {
      setError('User not found. Cannot save Zikr.');
      return;
    }

    try {
      await addDoc(collection(db, customZikrCollectionPath), {
        name: newZikrName.trim(),
        target: target,
      });
      onClose();
      setNewZikrName('');
      setNewZikrTarget('100');
      setError('');
    } catch (err) {
      console.error("Error adding custom zikr:", err);
      setError('Could not save custom Zikr. Please try again.');
    }
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
        <View className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm flex flex-col">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white">Add Custom Zikr</Text>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View>
            <View className="space-y-4">
              <View>
                <Text className="block text-sm font-medium text-gray-400 mb-1">Zikr Name</Text>
                <TextInput
                  value={newZikrName}
                  onChangeText={setNewZikrName}
                  placeholder="e.g., Alhamdulillah"
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
                />
              </View>
              <View>
                <Text className="block text-sm font-medium text-gray-400 mb-1">Target</Text>
                <TextInput
                  keyboardType="numeric"
                  value={newZikrTarget}
                  onChangeText={setNewZikrTarget}
                  placeholder="100"
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
                />
              </View>
            </View>
            {error && <Text className="text-red-400 text-xs mt-3 text-center">{error}</Text>}
            <View className="mt-6">
              <TouchableOpacity onPress={handleAddCustomZikr} className="w-full flex-row items-center justify-center px-4 py-3 bg-[#34D399] text-black font-bold rounded-xl">
                <Ionicons name="add-circle-outline" size={20} color="black" />
                <Text className="text-black ml-2">Save Zikr</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCustomZikrModal;
