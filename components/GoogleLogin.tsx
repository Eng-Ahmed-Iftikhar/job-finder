import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import GoogleIcon from "@/assets/images/google.png"; // Ensure the path is correct

function GoogleLogin() {
  return (
    <TouchableOpacity className="flex-row items-center justify-center bg-gray-100 h-10 rounded-lg shadow-md">
      <Image source={GoogleIcon} className="h-4 w-4 mr-2" />
      <Text className="text-gray-700">Continue with Google</Text>
    </TouchableOpacity>
  );
}

export default GoogleLogin;
