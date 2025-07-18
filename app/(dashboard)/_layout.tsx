import { Stack } from "expo-router";
import React from "react";

function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default DashboardLayout;
