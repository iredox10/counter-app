
import React, { useContext } from 'react';
import { View } from 'react-native';
import TodaysZikrList from '../components/TodaysZikrList';
import { AppContext } from './_layout';

const TodayPage = () => {
  const { userId, loadZikrData } = useContext(AppContext);

  const onSelectZikr = (zikr) => {
    loadZikrData(zikr.name);
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <TodaysZikrList userId={userId} onSelectZikr={onSelectZikr} />
    </View>
  );
};

export default TodayPage;
