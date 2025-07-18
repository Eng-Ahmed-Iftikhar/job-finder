import Logo from "@/assets/logo.png";
import useOnboarding from "@/hooks/useOnboarding";
import StepIndicator from "@/sections/onboarding/StepIndicator";
import React, { useMemo } from "react";
import { Image, View } from "react-native";

function OnboardingLayout() {
  const { currentStep = "", onboardingSteps } = useOnboarding();
  const currentIdx = useMemo(() => {
    return (
      onboardingSteps.findIndex(
        (onboardingStep) => onboardingStep === currentStep
      ) + 1
    );
  }, [onboardingSteps, currentStep]);
  console.log({ currentStep });

  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] items-center justify-center ">
        <Image source={Logo} className="h-[40px] w-[76px]" />
      </View>
      <StepIndicator total={onboardingSteps.length} current={currentIdx} />
    </View>
  );
}

export default OnboardingLayout;
