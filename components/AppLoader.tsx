import React from "react";
import { Image, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import AppLogo from "../assets/logo.png"; // Adjust the path as necessary
function AppLoader() {
  return (
    <View className="flex-1 items-center justify-center ">
      <Image className="h-32 w-32" source={AppLogo} />
      <View className="animate-spin">
        <Icon name="loading1" size={18} color="blue" />
      </View>
    </View>
  );
}

export default AppLoader;
