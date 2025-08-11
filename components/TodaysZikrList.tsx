
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp, collection, query, where, onSnapshot } from '../config/firebase';
import { db } from '../config/firebase';
import { AppContext } from '../app/_layout';

const TodaysZikrList = ({ onSelectZikr }) => {
  const { userId, zikrCollectionPath } = useContext(AppContext);
  const [todaysZikr, setTodaysZikr] = useState([]);

  useEffect(() => {
    if (!zikrCollectionPath) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(collection(db, zikrCollectionPath), where("date", "==", todayTimestamp));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const zikrList = [];
      querySnapshot.forEach((doc) => {
        zikrList.push({ id: doc.id, ...doc.data() });
      });
      setTodaysZikr(zikrList);
    });

    return () => unsubscribe();
  }, [zikrCollectionPath, userId]);

  const inProgress = todaysZikr.filter(z => z.count < z.target);
  const completed = todaysZikr.filter(z => z.count >= z.target);

  const handleSelect = (zikrDoc) => {
    onSelectZikr({
      name: zikrDoc.name,
      count: zikrDoc.count || 0,
      target: zikrDoc.target || 100,
    });
  }

  if (todaysZikr.length === 0) {
    return (
      <View className="bg-[#1E1E1E] rounded-3xl p-6 mt-8 text-center">
        <Text className="text-xl font-semibold text-white mb-4">Today's Progress</Text>
        <Text className="text-gray-400">No Zikr started for today. Begin by using the counter on the Home page.</Text>
      </View>
    )
  };

  return (
    <View className="bg-[#1E1E1E] rounded-3xl p-6">
      <Text className="text-xl font-semibold text-white mb-4">Today's Progress</Text>

      {inProgress.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-yellow-400 mb-2">In Progress</Text>
          <View className="space-y-2">
            {inProgress.map(zikr => (
              <TouchableOpacity key={zikr.id} onPress={() => handleSelect(zikr)} className="w-full text-left p-3 bg-[#374151] rounded-xl flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-white">{zikr.name}</Text>
                  <Text className="text-xs text-gray-400">{zikr.count} / {zikr.target}</Text>
                </View>
                <Ionicons name="flash" size={20} color="yellow" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {completed.length > 0 && (
        <View>
          <Text className="text-sm font-semibold text-green-400 mb-2">Completed</Text>
          <View className="space-y-2">
            {completed.map(zikr => (
              <View key={zikr.id} className="w-full text-left p-3 bg-[#374151] bg-opacity-50 rounded-xl flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-400 line-through">{zikr.name}</Text>
                  <Text className="text-xs text-gray-500">{zikr.count} / {zikr.target}</Text>
                </View>
                <Ionicons name="checkmark" size={20} color="green" />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default TodaysZikrList;
