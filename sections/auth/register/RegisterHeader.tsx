import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

function RegisterHeader() {
  return (
    <View className="flex items-center ">
      <Text className=" text-2xl font-semibold ">Sign up to find a job</Text>
      <Text className="text-sm mt-2">
        Already have an account?{" "}
        <Link href="/(auth)/login" className="text-azure-radiance-500">
          Sign in
        </Link>
      </Text>
    </View>
  );
}

export default RegisterHeader;
