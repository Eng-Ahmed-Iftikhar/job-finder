import React from "react";
import { Text, View } from "react-native";

function VerifyEmailHeader() {
  return (
    <View className="flex items-center w-3/4 mx-auto">
      <Text className=" text-2xl font-semibold ">Confirm your email</Text>
      <Text className="text-sm text-gray-400 text-center  mt-2">
        Please enter the code we’ve sent to youremail@hotmail.com
      </Text>
    </View>
  );
}

export default VerifyEmailHeader;
