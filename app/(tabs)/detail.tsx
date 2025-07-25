import { Image, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import React, { useState } from "react";

const workouts = [
  {
    id: "1",
    name: "Full Body Blast",
    exercises: ["Push-ups", "Squats", "Burpees"],
  },
  {
    id: "2",
    name: "Upper Body Strength",
    exercises: ["Pull-ups", "Push-ups", "Dips"],
  },
  {
    id: "3",
    name: "Core Crusher",
    exercises: ["Plank", "Sit-ups", "Leg Raises"],
  },
];

const Detail = () => {
  const email = auth.currentUser?.email;
  const username = email ? email.split("@")[0] : "User";
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);

  // Start timer and auto-advance through exercises
  const startWorkout = (workoutIdx: number) => {
    setSelectedWorkout(workoutIdx);
    router.navigate({
      pathname: "/timerPage",
      params: {
        exercises: JSON.stringify(workouts[workoutIdx].exercises),
        workoutName: workouts[workoutIdx].name,
      },
    });
  };

  const renderWorkout = ({
    item,
    index,
  }: {
    item: (typeof workouts)[0];
    index: number;
  }) => (
    <View className="flex bg-secondary-1000 W-[363px] h-[164px] rounded-[65px] mt-8 mr-4 ml-4 ">
      <View className="justify-center items-center">
        <Text className="text-black text-[24px] font-bold ">{item.name}</Text>
      </View>
      <View className="items-start ml-[45px]">
        <Text className="text-[30px] font-bold text-general-1000 ">
          Exercise
        </Text>
        <Text className="text-black text-[24px] font-extrabold">
          {item.exercises.join("\n")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => startWorkout(index)}
        className="absolute bottom-0 right-0 mr-5 mb-4 bg-general-1000 rounded-full w-[73px] h-[73px] items-center justify-center"
      >
        <Text className="text-white font-bold text-[24px] ">Start</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between">
      <View className="flex flex-col absolute top-0 bottom-0 left-0 right-0">
        <View className="w-full h-[137px]">
          <Image
            source={images.homeHeader}
            resizeMode="cover"
            className="w-full h-[160px]"
          />
          <Image
            source={images.animoji}
            resizeMode="contain"
            className="w-[84px] h-[84px] absolute top-[32px] left-4"
          />
          <Text className="text-[24px] font-bold text-white text-left absolute top-[50px] left-[110px]">
            Hello👋{"\n"}
            {username}
          </Text>
          <View className="w-[54px] h-[54px] absolute top-[50px] right-[20px] rounded-full bg-white items-center justify-center">
            <Image
              source={icons.logOut}
              resizeMode="contain"
              className="w-[24px] h-[20px]"
            />
          </View>
        </View>
        <View className="flex flex-col bg-white p-3">
          <FlatList
            data={workouts}
            renderItem={renderWorkout}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Detail;
