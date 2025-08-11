
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, doc, updateDoc } from '../config/firebase';
import { AppContext } from '../app/_layout';

const EditCustomZikrModal = ({ isVisible, onClose, zikrToEdit }) => {
  const { userId } = useContext(AppContext);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('100');
  const [error, setError] = useState('');

  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/default-zikr-app/users/${userId}/custom_zikr` : null, [userId]);

  useEffect(() => {
    if (zikrToEdit) {
      setName(zikrToEdit.name);
      setTarget(zikrToEdit.target.toString());
    }
  }, [zikrToEdit]);

  const handleUpdateZikr = async () => {
    if (!name.trim()) {
      setError('Please enter a name for the Zikr.');
      return;
    }
    const newTarget = parseInt(target, 10);
    if (isNaN(newTarget) || newTarget <= 0) {
      setError('Target must be a number greater than zero.');
      return;
    }
    if (!customZikrCollectionPath || !zikrToEdit?.id) {
      setError('Cannot update Zikr. Invalid data.');
      return;
    }

    const docRef = doc(db, customZikrCollectionPath, zikrToEdit.id);

    try {
      await updateDoc(docRef, {
        name: name.trim(),
        target: newTarget,
      });
      onClose();
      setError('');
    } catch (err) {
      console.error("Error updating custom zikr:", err);
      setError('Could not update custom Zikr. Please try again.');
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
            <Text className="text-xl font-bold text-white">Edit Custom Zikr</Text>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View>
            <View className="space-y-4">
              <View>
                <Text className="block text-sm font-medium text-gray-400 mb-1">Zikr Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
                />
              </View>
              <View>
                <Text className="block text-sm font-medium text-gray-400 mb-1">Target</Text>
                <TextInput
                  keyboardType="numeric"
                  value={target}
                  onChangeText={setTarget}
                  className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg text-gray-200"
                />
              </View>
            </View>
            {error && <Text className="text-red-400 text-xs mt-3 text-center">{error}</Text>}
            <View className="mt-6">
              <TouchableOpacity onPress={handleUpdateZikr} className="w-full flex-row items-center justify-center px-4 py-3 bg-[#34D399] text-black font-bold rounded-xl">
                <Ionicons name="checkmark-circle-outline" size={20} color="black" />
                <Text className="text-black ml-2">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCustomZikrModal;
