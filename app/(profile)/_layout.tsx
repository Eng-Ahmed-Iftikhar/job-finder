import Logo from "@/assets/logo.png";
import { useUser } from "@/hooks/useUser";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

export default function ProfileLayout() {
  const router = useRouter();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(auth)/");
    }
  }, [isLoggedIn, router]);

  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] items-center justify-center ">
        <Image source={Logo} className="h-[40px] w-[76px]" />
      </View>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
