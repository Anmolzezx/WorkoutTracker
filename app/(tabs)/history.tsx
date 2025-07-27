import { Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper to get week start (Monday) for a date string
function getWeekStart(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - ((day + 6) % 7); // Monday as start
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

// Helper to get all days in a week (Mon-Sun) for a week start date
function getWeekDays(weekStart: string) {
  const days = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isToday(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
}

const History = () => {
  const [weekly, setWeekly] = useState<
    { weekStart: string; days: string[]; completed: Record<string, string[]> }[]
  >([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AsyncStorage.getItem("workoutHistory");
        if (data) {
          const parsed = JSON.parse(data);

          // Group by week, but collect exercises instead of workoutName
          const weekMap: Record<string, { [date: string]: string[] }> = {};
          parsed.forEach((entry: { workoutName: string; date: string }) => {
            const weekStart = getWeekStart(entry.date);
            if (!weekMap[weekStart]) weekMap[weekStart] = {};
            if (!weekMap[weekStart][entry.date])
              weekMap[weekStart][entry.date] = [];
            // If workoutName is "All Exercises", show all exercises, else show the exercises for that workout
            // Try to parse exercises from workoutName if possible
            let exercises: string[] = [];
            if (entry.workoutName === "All Exercises") {
              // Use the same list as in detail.tsx
              exercises = [
                "Plank",
                "High Knees",
                "Russian Twists",
                "Superman",
                "Bicycle Crunches",
                "Wall Sit",
                "Jump Squats",
                "Reverse Lunges",
                "Side Plank",
                "Flutter Kicks",
                "Bear Crawl",
                "Donkey Kicks",
                "Inchworms",
                "Toe Touches",
                "Skaters",
                "Mountain Climbers",
                "V-Ups",
                "Jumping Lunges",
                "Single Leg Glute Bridge",
                "Dead Bug",
              ];
            } else if (entry.workoutName === "Full Body") {
              exercises = ["Jumping Jacks", "Mountain Climbers", "Burpees"];
            } else if (entry.workoutName === "Upper Body") {
              exercises = ["Push Ups", "Shoulder Taps", "Tricep Dips"];
            } else if (entry.workoutName === "Lower Body") {
              exercises = ["Squats", "Lunges", "Glute Bridge"];
            } else {
              // fallback: show workoutName as a single exercise
              exercises = [entry.workoutName];
            }
            weekMap[weekStart][entry.date].push(...exercises);
          });
          // Remove duplicates for each day
          Object.values(weekMap).forEach((daysObj) => {
            Object.keys(daysObj).forEach((date) => {
              daysObj[date] = Array.from(new Set(daysObj[date]));
            });
          });
          const weeks = Object.keys(weekMap)
            .sort((a, b) => (a < b ? 1 : -1))
            .map((weekStart) => ({
              weekStart,
              days: getWeekDays(weekStart),
              completed: weekMap[weekStart],
            }));
          setWeekly(weeks);
        }
      } catch {}
    };
    fetchHistory();
  }, []);

  // Always show current week at top, even if empty
  const today = new Date();
  const currentWeekStart = getWeekStart(today.toISOString().slice(0, 10));
  const currentWeek = weekly.find((w) => w.weekStart === currentWeekStart) || {
    weekStart: currentWeekStart,
    days: getWeekDays(currentWeekStart),
    completed: {},
  };
  const otherWeeks = weekly.filter((w) => w.weekStart !== currentWeekStart);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-4">
        <Text className="text-[28px] font-bold mb-4">Exercise History</Text>
        <View className="flex-row items-center mb-2">
          <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <Text className="text-xs mr-4">Today</Text>
          <View className="w-3 h-3 rounded-full bg-green-400 mr-2" />
          <Text className="text-xs mr-4">Completed</Text>
          <View className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
          <Text className="text-xs">No workout</Text>
        </View>
        <ScrollView>
          {/* Current week calendar */}
          <View className="mb-6 bg-white rounded-2xl shadow p-4">
            <Text className="text-[18px] font-bold mb-2">
              This Week ({currentWeek.weekStart})
            </Text>
            <View className="flex-row justify-between mb-1">
              {dayLabels.map((label) => (
                <Text
                  key={label}
                  className="text-xs font-semibold text-gray-500 w-8 text-center"
                >
                  {label}
                </Text>
              ))}
            </View>
            <View className="flex-row justify-between mb-2">
              {currentWeek.days.map((date, i) => {
                const isDone = !!currentWeek.completed[date];
                const isNow = isToday(date);
                return (
                  <View
                    key={date}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      isNow
                        ? "bg-blue-500"
                        : isDone
                          ? "bg-green-400"
                          : "bg-gray-300"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOpacity: isNow ? 0.25 : 0,
                      shadowRadius: 4,
                      elevation: isNow ? 4 : 0,
                    }}
                  >
                    <Text className="text-xs font-bold text-white">
                      {new Date(date).getDate()}
                    </Text>
                    {/* Dots for multiple exercises */}
                    {isDone && (
                      <View className="flex-row absolute bottom-1 left-1 right-1 justify-center">
                        {currentWeek.completed[date]
                          .slice(0, 5)
                          .map((_, idx) => (
                            <View
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"
                            />
                          ))}
                        {currentWeek.completed[date].length > 5 && (
                          <Text className="text-[8px] text-white ml-1">+</Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
            {/* List exercises for each completed day */}
            <View className="mt-2">
              {currentWeek.days.map(
                (date) =>
                  currentWeek.completed[date] && (
                    <View key={date} className="mb-1">
                      <Text className="text-xs text-gray-700 font-semibold">
                        {date}:
                      </Text>
                      {currentWeek.completed[date].map((ex, i) => (
                        <Text key={i} className="text-xs ml-2">
                          • {ex}
                        </Text>
                      ))}
                    </View>
                  ),
              )}
            </View>
          </View>
          {/* Other weeks */}
          {otherWeeks.map((week) => (
            <View
              key={week.weekStart}
              className="mb-6 bg-white rounded-2xl shadow p-4"
            >
              <Text className="text-[18px] font-bold mb-2">
                Week of {week.weekStart}
              </Text>
              <View className="flex-row justify-between mb-1">
                {dayLabels.map((label) => (
                  <Text
                    key={label}
                    className="text-xs font-semibold text-gray-500 w-8 text-center"
                  >
                    {label}
                  </Text>
                ))}
              </View>
              <View className="flex-row justify-between mb-2">
                {week.days.map((date, i) => {
                  const isDone = !!week.completed[date];
                  const isNow = isToday(date);
                  return (
                    <View
                      key={date}
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        isNow
                          ? "bg-blue-500"
                          : isDone
                            ? "bg-green-400"
                            : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-xs font-bold text-white">
                        {new Date(date).getDate()}
                      </Text>
                      {isDone && (
                        <View className="flex-row absolute bottom-1 left-1 right-1 justify-center">
                          {week.completed[date].slice(0, 5).map((_, idx) => (
                            <View
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"
                            />
                          ))}
                          {week.completed[date].length > 5 && (
                            <Text className="text-[8px] text-white ml-1">
                              +
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <View className="mt-2">
                {week.days.map(
                  (date) =>
                    week.completed[date] && (
                      <View key={date} className="mb-1">
                        <Text className="text-xs text-gray-700 font-semibold">
                          {date}:
                        </Text>
                        {week.completed[date].map((ex, i) => (
                          <Text key={i} className="text-xs ml-2">
                            • {ex}
                          </Text>
                        ))}
                      </View>
                    ),
                )}
              </View>
            </View>
          ))}
          {weekly.length === 0 && (
            <Text className="text-gray-400 mt-8 text-center">
              No exercises completed yet.
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default History;
