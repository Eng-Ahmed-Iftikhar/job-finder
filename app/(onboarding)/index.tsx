import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { View } from "react-native";

function index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(onboarding)/general-info");
  }, []);

  return (
    <View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-bold">
          Welcome to the Onboarding Screen
        </Text>
      </View>
    </View>
  );
}

export default index;
