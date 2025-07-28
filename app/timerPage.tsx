import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Vibration } from "react-native";
import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXERCISE_DURATION = 5;

export default function TimerPage() {
  const params = useLocalSearchParams();
  const exercises: string[] = params.exercises
    ? JSON.parse(params.exercises as string)
    : ["Exercise"];

  const workoutName: string = params.workoutName
    ? String(params.workoutName)
    : "Workout";
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleComplete = () => {
    Vibration.vibrate(100);
    if (exerciseIdx < exercises.length - 1) {
      setExerciseIdx((idx) => idx + 1);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 300);
      return { shouldRepeat: false };
    } else {
      (async () => {
        const today = new Date().toISOString().slice(0, 10);
        const entries = exercises.map((exercise) => ({
          exercise,
          workoutName,
          date: today,
        }));
        try {
          const prev = await AsyncStorage.getItem("workoutHistory");
          const history = prev ? JSON.parse(prev) : [];
          await AsyncStorage.setItem(
            "workoutHistory",
            JSON.stringify([...history, ...entries]),
          );
        } catch {}
        router.replace({ pathname: "/(tabs)/history" });
      })();
      return { shouldRepeat: false };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center ">
      <View className="flex flex-col absolute top-0 bottom-0 left-0 right-0">
        <View className="w-full h-[80px] bg-white rounded-full shadow-md shadow-neutral-400/70 justify-center mt-5">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack?.()) {
                router.back();
              } else {
                router.replace("/(tabs)/home");
              }
            }}
            className="absolute top-[10px] left-8 z-10"
          >
            <Image
              source={icons.backArrow}
              resizeMode="contain"
              className="w-[30px] h-[30px]"
            />
          </TouchableOpacity>
          <Text className="text-black text-[30px] text-center font-bold">
            {workoutName}
          </Text>
        </View>
        <View className="justify-center w-full h-[38px] mt-8">
          <Text className="text-[30px] text-general-1000 font-bold text-center">
            {exercises[exerciseIdx]}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center bg-white mt-4">
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={EXERCISE_DURATION}
            key={exerciseIdx}
            colors="#FC713A"
            trailColor="#EAE8FF"
            size={220}
            strokeWidth={18}
            onComplete={handleComplete}
          >
            {({ remainingTime }) => {
              const minutes = String(Math.floor(remainingTime / 60)).padStart(
                2,
                "0",
              );
              const seconds = String(remainingTime % 60).padStart(2, "0");
              return (
                <Text className="text-[40px] font-bold text-[#0C051A]">
                  {minutes}:{seconds}
                </Text>
              );
            }}
          </CountdownCircleTimer>
          <View className="flex flex-row items-center justify-center mt-8">
            <TouchableOpacity
              onPress={() => {
                setIsPlaying((p) => !p);
                Vibration.vibrate(10);
              }}
              className="w-[60px] h-[60px] rounded-full bg-white items-center justify-center mr-8 "
            >
              <Image
                source={icons.pause}
                resizeMode="contain"
                className="w-[60px] h-[60px]"
              />
              <Text className="text-black text-[14px]">
                {isPlaying ? "Pause" : "Resume"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Vibration.vibrate(10);
                router.replace("/(tabs)/home");
              }}
              className="w-[60px] h-[60px] rounded-full bg-white items-center justify-center "
            >
              <Image
                source={icons.quit}
                resizeMode="contain"
                className="w-[60px] h-[60px]"
              />
              <Text className="text-black text-[14px]">Quit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
