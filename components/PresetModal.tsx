
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRESET_ZIKR } from '../config/constant';
import { db, collection, onSnapshot, query } from '../config/firebase';
import { AppContext } from '../app/_layout';

const PresetModal = ({ isVisible, onClose, onSelect, onAdd, onEdit, onDelete }) => {
  const { userId } = useContext(AppContext);
  const [customZikrList, setCustomZikrList] = useState([]);
  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/default-zikr-app/users/${userId}/custom_zikr` : null, [userId]);

  useEffect(() => {
    if (!isVisible || !customZikrCollectionPath) return;
    const q = query(collection(db, customZikrCollectionPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomZikrList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [isVisible, customZikrCollectionPath]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 p-4">
        <View className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm flex max-h-[90vh]">
          <View className="flex-row justify-between items-center mb-4 shrink-0">
            <Text className="text-xl font-bold text-white flex-row items-center">
              <Ionicons name="book-outline" size={20} color="#34D399" /> Select a Zikr
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-3 mb-4">
            {/* Preset Zikr */}
            {PRESET_ZIKR.map((zikr) => (
              <TouchableOpacity key={zikr.name} onPress={() => onSelect(zikr)} className="w-full text-left p-4 bg-[#374151] rounded-xl">
                <Text className="font-semibold text-gray-200">{zikr.name}</Text>
                {zikr.arabic && <Text className="text-right text-2xl font-['Amiri',_serif] text-[#34D399]">{zikr.arabic}</Text>}
                <Text className="text-sm text-gray-400">Target: {zikr.target}</Text>
              </TouchableOpacity>
            ))}
            {/* Custom Zikr */}
            {customZikrList.map((zikr) => (
              <View key={zikr.id} className="group relative bg-[#374151] rounded-xl">
                <TouchableOpacity onPress={() => onSelect(zikr)} className="w-full text-left p-4 rounded-xl">
                  <Text className="font-semibold text-gray-200">{zikr.name}</Text>
                  <Text className="text-sm text-gray-400">Target: {zikr.target}</Text>
                </TouchableOpacity>
                <View className="absolute top-1/2 right-4 -translate-y-1/2 flex-row items-center space-x-2">
                  <TouchableOpacity onPress={() => onEdit(zikr)} className="p-2 rounded-full">
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(zikr)} className="p-2 rounded-full">
                    <Ionicons name="trash" size={16} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="mt-auto shrink-0 pt-4 border-t border-gray-700">
            <TouchableOpacity onPress={onAdd} className="w-full flex-row items-center justify-center px-4 py-3 bg-[#374151] font-semibold rounded-xl">
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text className="text-white ml-2">Add Custom Zikr</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PresetModal;
