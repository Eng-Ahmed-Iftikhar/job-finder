import { useUser } from "@/hooks/useUser";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

function DashboardLayout() {
  const router = useRouter();
  const { isLoggedIn } = useUser();

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
