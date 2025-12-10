import React, { useEffect } from "react";
import { Text, View } from "react-native";
import useOnboarding from "@/hooks/useOnboarding";
import { useRouter } from "expo-router";
import AppLoader from "@/components/AppLoader";

function OnboardingIndexScreen() {
  const { currentStep, stepHeader } = useOnboarding();
  const router = useRouter();
  useEffect(() => {
    if (currentStep) {
      router.replace(`/(onboarding)/${currentStep}`);
    }
  }, [currentStep]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-bold text-gray-900">
        Welcome to the Onboarding Screen
      </Text>
      <AppLoader />
    </View>
  );
}

export default OnboardingIndexScreen;
