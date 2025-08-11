import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ZikrCounter from '../components/ZikrCounter';
import { AppContext } from './_layout';
import PresetModal from '../components/PresetModal';
import TargetModal from '../components/TargetModal';
import AddCustomZikrModal from '../components/AddCustomZikrModal';
import EditCustomZikrModal from '../components/EditCustomZikrModal';
import ConfirmationModal from '../components/ConfirmationModal';
import TargetReachedModal from '../components/TargetReachedModal';
import { db, doc, deleteDoc } from '../config/firebase';
import { Audio } from 'expo-audio';

const HomePage = () => {
  const { userId, activeZikr, setActiveZikr, inputValue, setInputValue, saveZikr, loadZikrData } = useContext(AppContext);

  // State Management for ALL Modals
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZikr, setEditingZikr] = useState(null);
  const [deletingZikr, setDeletingZikr] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTargetReached, setShowTargetReached] = useState(false);
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [nextZikr, setNextZikr] = useState(null);
  const [sound, setSound] = useState();

  // Sound Effect Handling
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/count.mp3'));
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // Zikr Logic
  const handleIncrement = useCallback(() => {
    if (showTargetReached) return;
    const newCount = activeZikr.count + 1;
    const updatedZikr = { ...activeZikr, count: newCount };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    if (newCount === activeZikr.target) {
      playSound();
      setShowTargetReached(true);
    }
  }, [activeZikr, saveZikr, setActiveZikr, showTargetReached]);

  const handleReset = () => {
    const updatedZikr = { ...activeZikr, count: 0 };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    setShowResetConfirm(false);
  };

  // Zikr Switching Logic
  const attemptToSwitchZikr = (newZikrLoader) => {
    const isInProgress = activeZikr.count > 0 && activeZikr.count < activeZikr.target;
    if (isInProgress) {
      setNextZikr(() => newZikrLoader);
      setShowConfirmSwitch(true);
    } else {
      newZikrLoader();
    }
  };

  const confirmAndSwitch = () => {
    if (nextZikr) {
      nextZikr();
    }
    setShowConfirmSwitch(false);
    setNextZikr(null);
  };

  const handleSelectPreset = (preset) => {
    attemptToSwitchZikr(() => {
      const updatedZikr = { name: preset.name, target: preset.target, count: 0, deadline: '', reminderInterval: 0 };
      setActiveZikr(updatedZikr);
      setInputValue(preset.name);
      saveZikr(updatedZikr);
      setShowPresetModal(false);
    });
  };

  const handleInputBlur = () => {
    if (inputValue !== activeZikr.name) {
      attemptToSwitchZikr(() => loadZikrData(inputValue));
    }
  };

  // CRUD operations
  const handleDeleteZikr = async () => {
    if (!deletingZikr || !userId) return;
    // Note: The path should match your Firebase structure.
    const docRef = doc(db, `/artifacts/default-zikr-app/users/${userId}/custom_zikr`, deletingZikr.id);
    try {
      await deleteDoc(docRef);
      setDeletingZikr(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSaveTarget = (data) => {
    const updated = { ...activeZikr, ...data };
    setActiveZikr(updated);
    saveZikr(updated);
    setShowTargetModal(false);
  };

  const progress = activeZikr.target > 0 ? Math.min((activeZikr.count / activeZikr.target) * 100, 100) : 0;

  return (
    <View className="flex-1 bg-gray-900 p-4 justify-center">
      <View className="bg-[#1E1E1E] rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleInputBlur}
          placeholder="Name of Zikr"
          placeholderTextColor="#6B7280"
          className="text-2xl font-bold bg-transparent text-center w-full mb-6 text-gray-300"
        />
        <ZikrCounter progress={progress} count={activeZikr.count} target={activeZikr.target} onIncrement={handleIncrement} />
        <View className="flex-row items-center justify-center gap-4 mt-6">
          <TouchableOpacity onPress={() => setShowResetConfirm(true)} className="p-3 bg-[#374151] rounded-full">
            <Ionicons name="refresh" size={24} color="#D1D5DB" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPresetModal(true)} className="p-3 bg-[#374151] rounded-full">
            <Ionicons name="book-outline" size={24} color="#D1D5DB" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTargetModal(true)} className="p-3 bg-[#374151] rounded-full">
            <Ionicons name="settings-outline" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <PresetModal
        isVisible={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        onSelect={handleSelectPreset}
        onAdd={() => { setShowPresetModal(false); setShowAddModal(true); }}
        onEdit={(zikr) => { setShowPresetModal(false); setEditingZikr(zikr); }}
        onDelete={(zikr) => { setShowPresetModal(false); setDeletingZikr(zikr); }}
      />
      <AddCustomZikrModal isVisible={showAddModal} onClose={() => setShowAddModal(false)} userId={userId} />
      <EditCustomZikrModal isVisible={!!editingZikr} onClose={() => setEditingZikr(null)} userId={userId} zikrToEdit={editingZikr} />
      <TargetModal isVisible={showTargetModal} onClose={() => setShowTargetModal(false)} onSave={handleSaveTarget} currentZikr={activeZikr} />

      <ConfirmationModal
        isVisible={!!deletingZikr}
        icon="alert-circle-outline"
        color="red"
        title="Delete Zikr?"
        message={`Are you sure you want to permanently delete "${deletingZikr?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteZikr}
        onCancel={() => setDeletingZikr(null)}
      />
      <ConfirmationModal
        isVisible={showResetConfirm}
        icon="alert-circle-outline"
        color="yellow"
        title="Reset Counter?"
        message="Are you sure you want to reset your current count to zero?"
        confirmText="Reset"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
      <ConfirmationModal
        isVisible={showConfirmSwitch}
        icon="alert-circle-outline"
        color="yellow"
        title="Switch Zikr?"
        message="Your current Zikr is in progress. Are you sure you want to switch? Your progress will be saved."
        confirmText="Switch"
        onConfirm={confirmAndSwitch}
        onCancel={() => setShowConfirmSwitch(false)}
      />
      <TargetReachedModal
        isVisible={showTargetReached}
        zikrName={activeZikr.name}
        onContinue={() => setShowTargetReached(false)}
        onNew={() => {
          setShowTargetReached(false);
          setShowPresetModal(true);
        }}
      />
    </View>
  );
};

export default HomePage;
