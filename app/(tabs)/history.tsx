import { Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const History = () => {
  const [history, setHistory] = useState<
    { workoutName: string; date: string }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AsyncStorage.getItem("workoutHistory");
        if (data) setHistory(JSON.parse(data));
      } catch {}
    };
    fetchHistory();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-[28px] font-bold mb-4">Workout History</Text>
      <FlatList
        data={history}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View className="mb-3 p-3 bg-secondary-1000 rounded-xl">
            <Text className="text-[18px] font-bold">{item.workoutName}</Text>
            <Text className="text-[14px] text-gray-600">{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 mt-8 text-center">
            No workouts completed yet.
          </Text>
        }
      />
    </View>
  );
};
export default History;
