import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

function LoginHeader() {
  return (
    <View className="flex items-center ">
      <Text className=" text-2xl font-semibold ">Login</Text>
      <Text className="text-sm font-medium mt-2 font-medium">
        Don’t have an account?{" "}
        <Link href="/(auth)/register" className="text-azure-radiance-500">
          Sign up
        </Link>
      </Text>
    </View>
  );
}

export default LoginHeader;
