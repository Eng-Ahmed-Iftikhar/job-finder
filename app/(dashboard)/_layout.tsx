import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";

function DashboardLayout() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(auth)/");
    }
  }, [isLoggedIn, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default DashboardLayout;
