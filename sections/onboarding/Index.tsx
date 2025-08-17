import React from "react";
import { Text, View } from "react-native";
import useOnboarding from "@/hooks/useOnboarding";

function OnboardingIndexScreen() {
  const { currentStep, stepHeader } = useOnboarding();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-bold text-gray-900">
        Welcome to the Onboarding Screen
      </Text>
      <Text className="text-gray-600 mt-2">
        Current step: {currentStep}
      </Text>
      {stepHeader && (
        <View className="mt-4 px-4">
          <Text className="text-center text-gray-800 font-semibold">
            {stepHeader.title}
          </Text>
          <Text className="text-center text-gray-600 mt-2">
            {stepHeader.description}
          </Text>
        </View>
      )}
    </View>
  );
}

export default OnboardingIndexScreen;
