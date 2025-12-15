import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

import Button from "@/components/ui/Button";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";

function PhoneVerificationScreen() {
  const { handleChangeCurrentStep } = useOnboarding();
  const router = useRouter();

  React.useEffect(() => {
    handleChangeCurrentStep(OnboardingSteps.PHONE_VERIFICATION);
  }, [handleChangeCurrentStep]);

  const handleNext = () => {
    // Navigate to next onboarding step (profile image)
    router.push("/(onboarding)/profile-image");
    handleChangeCurrentStep(OnboardingSteps.PICTURE_URL);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className="items-center justify-center flex-1">
        <View className="w-full">
          <Button onPress={handleNext} className="mt-8">
            Next
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default PhoneVerificationScreen;
