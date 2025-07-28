import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images, workouts } from "@/constants";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";

export default function HomeScreen() {
  const email = auth.currentUser?.email;
  const username = email ? email.split("@")[0] : "User";
  const timer = (item: (typeof workouts)[0]) =>
    router.navigate({
      pathname: "/timerPage",
      params: {
        exercises: JSON.stringify(item.exercises),
        workoutName: item.name,
      },
    });
  const logout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Success", "You are logged out");
        router.replace("/welcome");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  const renderWorkout = ({ item }: { item: (typeof workouts)[0] }) => (
    <View className="flex bg-secondary-1000 W-[363px] h-[164px] rounded-[65px] mt-8 mr-4 ml-4 ">
      <View className="justify-center items-center">
        <Text className="text-black text-[24px] font-MulishBold ">
          {item.name}
        </Text>
      </View>
      <View className="items-start ml-[45px]">
        <Text className="text-[30px] font-MulishBold text-general-1000 ">
          Exercise
        </Text>
        <Text className="text-black text-[24px] font-MulishRegular">
          {item.exercises.join("\n")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => timer(item)}
        className="absolute bottom-0 right-0 mr-5 mb-4 bg-general-1000 rounded-full w-[73px] h-[73px] items-center justify-center"
      >
        <Text className="text-white font-MulishBold text-[24px] ">Start</Text>
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
          <Text className="text-[24px] font-MulishBold text-white text-left absolute top-[50px] left-[110px]">
            Hello👋{"\n"}
            {username}
          </Text>
          <TouchableOpacity
            onPress={logout}
            className="w-[54px] h-[54px] absolute top-[50px] right-[20px] rounded-full bg-white items-center justify-center"
          >
            <Image
              source={icons.logOut}
              resizeMode="contain"
              className="w-[24px] h-[20px]"
            />
          </TouchableOpacity>
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
}
