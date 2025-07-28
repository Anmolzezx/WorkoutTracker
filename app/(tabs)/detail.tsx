import { Image, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images, exercises } from "@/constants";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import React from "react";

const Detail = () => {
  const email = auth.currentUser?.email;
  const username = email ? email.split("@")[0] : "User";

  const startWorkout = () => {
    router.navigate({
      pathname: "/timerPage",
      params: {
        exercises: JSON.stringify(exercises),
        workoutName: "All Exercises",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex absolute top-0 bottom-0 left-0 right-0">
        <View className="w-full h-[137px] mb-2">
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
          <Text className="text-[24px] font-bold text-white absolute top-[50px] left-[110px]">
            Hello👋{"\n"}
            {username}
          </Text>
          <View className="w-[54px] h-[54px] absolute top-[50px] right-[20px] rounded-full bg-white items-center justify-center shadow">
            <Image
              source={icons.logOut}
              resizeMode="contain"
              className="w-[24px] h-[20px]"
            />
          </View>
        </View>
        <View className="flex-1 bg-white px-4 pt-2 pb-0">
          <Text className="text-[32px] font-bold mb-4 text-center text-general-1000">
            Exercises
          </Text>
          <FlatList
            data={exercises}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => (
              <View className="mb-3 px-5 py-4 bg-secondary-1000 rounded-2xl shadow flex-row items-center">
                <View className="w-4 h-4 rounded-full bg-general-1000 mr-4" />
                <Text className="text-[18px] font-semibold text-black">
                  {item}
                </Text>
              </View>
            )}
          />
        </View>

        <View className="absolute left-0 right-0 items-center bottom-[90px] bg-transparent">
          <TouchableOpacity
            onPress={startWorkout}
            className="bg-general-1000 rounded-full w-[90px] h-[90px] items-center justify-center shadow-lg mb-4"
            activeOpacity={0.85}
            style={{
              shadowColor: "#FC713A",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text className="text-white font-extrabold text-[22px] tracking-wide uppercase">
              Start
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Detail;
