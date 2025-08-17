import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";

import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";

function PhoneVerificationScreen() {
  const { handleChangeCurrentStep, handleChangeStepHeader } = useOnboarding();
  const router = useRouter();

  React.useEffect(() => {
    handleChangeCurrentStep(OnboardingSteps.PHONE_VERIFICATION);
  }, [handleChangeCurrentStep]);

  const handleNext = () => {
    // Navigate to next onboarding step (profile image)
    router.push("/(onboarding)/profile-image");
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className="flex-1 mt-12">
        <View className="items-center justify-center flex-1">
          <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
            Phone Number Verified! ✅
          </Text>
          <Text className="text-gray-600 text-center mb-8 px-4">
            Great! Your phone number has been successfully verified. You can now
            proceed to the next step of your onboarding process.
          </Text>

          <View className="w-full">
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold text-center"
            >
              Continue to General Info
            </button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default PhoneVerificationScreen;
