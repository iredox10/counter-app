
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ZikrCounter from '../components/ZikrCounter';
import { AppContext } from './_layout';
import PresetModal from '../components/PresetModal';
import TargetModal from '../components/TargetModal';
import AddCustomZikrModal from '../components/AddCustomZikrModal';
import EditCustomZikrModal from '../components/EditCustomZikrModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ResetConfirmationModal from '../components/ResetConfirmationModal';
import TargetReachedModal from '../components/TargetReachedModal';
import { db, doc, deleteDoc } from '../config/firebase';
import { Audio } from 'expo-audio';

const HomePage = () => {
  const { userId, activeZikr, setActiveZikr, inputValue, setInputValue, saveZikr, loadZikrData, zikrCollectionPath } = useContext(AppContext);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZikr, setEditingZikr] = useState(null);
  const [deletingZikr, setDeletingZikr] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTargetReached, setShowTargetReached] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/count.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);


  const handleIncrement = () => {
    if (showTargetReached) return;
    const newCount = activeZikr.count + 1;
    const updatedZikr = { ...activeZikr, count: newCount };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    if (newCount === activeZikr.target) {
      playSound();
      setShowTargetReached(true);
    }
  };

  const handleReset = () => {
    const updatedZikr = { ...activeZikr, count: 0 };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    setShowResetConfirm(false);
  };

  const handleSelectPreset = (preset) => {
    const updatedZikr = { name: preset.name, target: preset.target, count: 0 };
    setActiveZikr(updatedZikr);
    setInputValue(preset.name);
    saveZikr(updatedZikr);
    setShowPresetModal(false);
  };

  const handleInputBlur = () => {
    if (inputValue !== activeZikr.name) {
      loadZikrData(inputValue);
    }
  };

  const handleSaveTarget = (data) => {
    const updated = { ...activeZikr, ...data };
    setActiveZikr(updated);
    saveZikr(updated);
    setShowTargetModal(false);
  };

  const handleEdit = (zikr) => {
    setEditingZikr(zikr);
    setShowPresetModal(false);
  };

  const handleDelete = (zikr) => {
    setDeletingZikr(zikr);
    setShowPresetModal(false);
  };

  const confirmDelete = async () => {
    if (!deletingZikr || !userId) return;
    const docRef = doc(db, `/artifacts/default-zikr-app/users/${userId}/custom_zikr`, deletingZikr.id);
    try {
      await deleteDoc(docRef);
      setDeletingZikr(null);
    } catch (error) { console.error("Error deleting document: ", error); }
  };


  const progress = activeZikr.target > 0 ? Math.min((activeZikr.count / activeZikr.target) * 100, 100) : 0;

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <View className="bg-[#1E1E1E] rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleInputBlur}
          placeholder="Name of Zikr"
          className="text-2xl font-bold bg-transparent text-center w-full mb-6 focus:outline-none text-gray-300 placeholder-gray-500"
        />
        <ZikrCounter progress={progress} count={activeZikr.count} target={activeZikr.target} onIncrement={handleIncrement} />
        <View className="flex-row items-center justify-center space-x-6 mt-6">
          <TouchableOpacity onPress={() => setShowResetConfirm(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors">
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPresetModal(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors">
            <Ionicons name="book-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTargetModal(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors">
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <PresetModal
        isVisible={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        onSelect={handleSelectPreset}
        onAdd={() => setShowAddModal(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TargetModal
        isVisible={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        onSave={handleSaveTarget}
        currentZikr={activeZikr}
      />
      <AddCustomZikrModal
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <EditCustomZikrModal
        isVisible={!!editingZikr}
        onClose={() => setEditingZikr(null)}
        zikrToEdit={editingZikr}
      />
      <DeleteConfirmationModal
        isVisible={!!deletingZikr}
        onCancel={() => setDeletingZikr(null)}
        onConfirm={confirmDelete}
        zikrName={deletingZikr?.name}
      />
      <ResetConfirmationModal
        isVisible={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
      <TargetReachedModal
        isVisible={showTargetReached}
        onContinue={() => setShowTargetReached(false)}
        onNew={() => {
          setShowTargetReached(false);
          setShowPresetModal(true);
        }}
        zikrName={activeZikr.name}
      />
    </View>
  );
};

export default HomePage;
