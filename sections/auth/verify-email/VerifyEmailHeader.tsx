import React from "react";
import { Text, View } from "react-native";
import { useUser } from "@/hooks/useUser";

function VerifyEmailHeader() {
  const { user } = useUser();

  return (
    <View className="flex items-center w-3/4 mx-auto">
      <Text className=" text-2xl font-semibold ">Confirm your email</Text>
      <Text className="text-sm text-gray-400 text-center  mt-2">
        Please enter the code we've sent to {user?.email.email || "your email"}
      </Text>
    </View>
  );
}

export default VerifyEmailHeader;
