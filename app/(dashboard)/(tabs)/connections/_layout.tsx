import AppLoader from "@/components/AppLoader";
import { Stack } from "expo-router";
import { Suspense } from "react";

export default function ConnectionsLayout() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Stack screenOptions={{ headerShown: false }} />
    </Suspense>
  );
}
