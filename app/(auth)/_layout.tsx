import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Logo from "@/assets/logo.png";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";

export default function AuthLayout() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(dashboard)/");
    }
  }, [isLoggedIn, router]);

  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] items-center justify-center ">
        <Image source={Logo} className="h-[40px] w-[76px]" />
      </View>

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
