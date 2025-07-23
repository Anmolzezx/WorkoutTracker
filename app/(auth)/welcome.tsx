import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between">
      <View className="flex flex-col absolute top-0 bottom-0 left-0 right-0 ">
        <View className="w-full ">
          <Image
            source={images.orange}
            className="w-full h-[410px]"
            resizeMode="cover"
          />
        </View>
        <View className="items-center px-6 mt-6">
          <Text className="text-[40px] font-bold text-black text-center mb-3">
            Lets Start{"\n"}Your Habits
          </Text>
          <Text className="text-[20px] text-gray-500 text-center mt-8 mb-8">
            Empower your{"\n"}fitness journey and{"\n"}achieve your goal{"\n"}
            with ease and insight.
          </Text>
        </View>
        <View className="flex items-center justify-center mr-8 ml-8">
          <CustomButton
            title="START NOW"
            onPress={() => router.push("/sign-in")}
            className="w-[300px] h-[73px] "
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Welcome;
