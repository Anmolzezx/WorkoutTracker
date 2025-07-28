import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) +
    " " +
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

const History = () => {
  const [history, setHistory] = useState<
    { date: string; exercise: string; workoutName: string }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AsyncStorage.getItem("workoutHistory");
        if (data) {
          const parsed = JSON.parse(data);
          parsed.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
          setHistory(parsed);
        }
      } catch {}
    };
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    await AsyncStorage.removeItem("workoutHistory");
    setHistory([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[28px] font-bold">Exercise History</Text>
          <TouchableOpacity onPress={clearHistory}>
            <Text
              className="text-blue-600 text-base"
              style={{ textDecorationLine: "underline" }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
        {history.length === 0 ? (
          <Text className="text-gray-400 mt-8 text-center">
            No exercises completed yet.
          </Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View
                className="mb-3 bg-white rounded-xl shadow p-4 border border-gray-100"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                <Text className="text-[16px] font-bold text-blue-700 mb-1">
                  {formatDateTime(item.date)}
                </Text>
                <Text className="text-[15px] text-gray-800 font-semibold">
                  {item.workoutName}
                </Text>
                <Text className="text-[15px] text-gray-600 ml-1 mt-1">
                  • {item.exercise}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default History;
