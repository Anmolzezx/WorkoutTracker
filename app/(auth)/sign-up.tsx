import { Alert, Image, Text, View } from "react-native";
import { icons, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUpPress = async () => {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;
      Alert.alert("Success", `Account created for ${user.email}`);
      router.replace("/sign-in");
    } catch (err: any) {
      console.error("Sign Up Error:", err.message);
      Alert.alert("Sign Up Failed", err.message);
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
            Create Your Account
          </Text>
        </View>
        <View className=" ml-4 p-5 mr-8">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6 items-center justify-center"
          />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SignUp;
