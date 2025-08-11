
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, onSnapshot } from '../config/firebase';
import { db } from '../config/firebase';
import { AppContext } from './_layout';

const screenWidth = Dimensions.get('window').width;

const StatsPage = () => {
  const { userId, zikrCollectionPath } = useContext(AppContext);
  const [historyData, setHistoryData] = useState([]);
  const [view, setView] = useState('daily');

  useEffect(() => {
    if (!zikrCollectionPath) return;
    const q = query(collection(db, zikrCollectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.date.seconds - a.date.seconds);
      setHistoryData(data);
    });
    return () => unsubscribe();
  }, [zikrCollectionPath]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filterByDate = (dateFilter) => historyData.filter(item => item.date.toDate() >= dateFilter);
    if (view === 'daily') return filterByDate(today);
    if (view === 'weekly') { const oneWeekAgo = new Date(today); oneWeekAgo.setDate(today.getDate() - 7); return filterByDate(oneWeekAgo); }
    if (view === 'monthly') { const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(today.getMonth() - 1); return filterByDate(oneMonthAgo); }
    return [];
  }, [historyData, view]);

  const chartData = useMemo(() => {
    const dataMap = new Map();
    filteredData.forEach(item => {
      const dateStr = item.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const currentCount = dataMap.get(dateStr)?.count || 0;
      dataMap.set(dateStr, { date: dateStr, count: currentCount + item.count });
    });
    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values()).map(item => item.count);
    return {
      labels,
      datasets: [{ data }]
    };
  }, [filteredData]);

  const totalZikr = filteredData.reduce((acc, item) => acc + item.count, 0);

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <View className="bg-[#1E1E1E] rounded-3xl p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-semibold text-white flex-row items-center">
            <Ionicons name="stats-chart" size={20} color="#34D399" /> Progress
          </Text>
          <View className="flex-row space-x-1 bg-[#374151] p-1 rounded-full text-sm">
            <TouchableOpacity onPress={() => setView('daily')} className={`px-3 py-1 rounded-full ${view === 'daily' ? 'bg-[#1E1E1E]' : ''}`}>
              <Text className={`${view === 'daily' ? 'text-white' : 'text-gray-400'}`}>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setView('weekly')} className={`px-3 py-1 rounded-full ${view === 'weekly' ? 'bg-[#1E1E1E]' : ''}`}>
              <Text className={`${view === 'weekly' ? 'text-white' : 'text-gray-400'}`}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setView('monthly')} className={`px-3 py-1 rounded-full ${view === 'monthly' ? 'bg-[#1E1E1E]' : ''}`}>
              <Text className={`${view === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="text-center mb-6">
          <Text className="text-gray-400 capitalize">{view} Total</Text>
          <Text className="text-4xl font-bold text-[#34D399]">{totalZikr}</Text>
        </View>
        <View className="h-60 mb-6">
          {chartData.labels.length > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#1E1E1E',
                backgroundGradientFrom: '#1E1E1E',
                backgroundGradientTo: '#1E1E1E',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              verticalLabelRotation={30}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">No data for this period</Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-lg font-semibold mb-3 text-white flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#34D399" /> Recent Activity
          </Text>
          <View className="space-y-2 max-h-40">
            {filteredData.length > 0 ? (
              filteredData.slice(0, 10).map((item) => (
                <View key={item.id} className="flex-row justify-between items-center p-3 rounded-xl bg-[#374151] bg-opacity-40">
                  <View>
                    <Text className="font-medium text-gray-200">{item.name}</Text>
                    <Text className="text-xs text-gray-400">{item.date.toDate().toLocaleDateString()}</Text>
                  </View>
                  <Text className="font-bold text-lg text-[#34D399]">{item.count}</Text>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-500 p-4">No Zikr recorded for this period.</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatsPage;
