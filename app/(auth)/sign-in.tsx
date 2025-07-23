import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      Alert.alert("Success", "You are logged in");
      router.replace("/home");
    } catch (err: any) {
      console.error("Sign In Error:", err.message);
      Alert.alert("Sign In Failed", err.message);
    }
  };

  return (
    <SafeAreaView className="flex h-full bg-white items-center justify-between">
      <View className="flex flex-col absolute top-0 bottom-0 left-0 right-0">
        <View className="w-full">
          <Image
            source={images.orangeHeader}
            className="w-full h-[410px]"
            resizeMode="cover"
          />
          <Text className="flex absolute top-36 bottom-0 left-0 right-0 font-bold text-black text-center items-center justify-center text-[50px]">
            Welcome👋
          </Text>
        </View>
        <View className=" ml-4 p-5 mr-8">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6 items-center justify-center"
          />
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
