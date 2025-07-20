import Logo from "@/assets/logo.png";
import useOnboarding from "@/hooks/useOnboarding";
import StepIndicator from "@/sections/onboarding/StepIndicator";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

function OnboardingLayout() {
  const router = useRouter();
  const {
    currentStep = "",
    onboardingSteps,
    stepHeader,
    handleChangeCurrentStep,
  } = useOnboarding();
  const currentIdx = useMemo(() => {
    return (
      onboardingSteps.findIndex(
        (onboardingStep) => onboardingStep === currentStep
      ) + 1
    );
  }, [onboardingSteps, currentStep]);

  const { title = "", description = "" } = stepHeader || {};
  const handleClickBack = useCallback(() => {
    handleChangeCurrentStep(onboardingSteps[currentIdx - 2]);
    router.back();
  }, []);

  const isShowBackIcon = useMemo(() => {
    return currentIdx > 1;
  }, [currentIdx]);

  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] flex-row items-center justify-between px-4 ">
        <View className="w-6 h-6">
          {isShowBackIcon && (
            <TouchableOpacity onPress={handleClickBack}>
              <Icon name="arrowleft" size={16} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <Image source={Logo} className="h-[40px] w-[76px]" />
        <TouchableOpacity>
          <Text className="text-sm text-azure-radiance-500 font-semibold ">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <StepIndicator total={onboardingSteps.length} current={currentIdx} />
      <View className="w-[300px]  mx-auto  mt-3 ">
        <Text className=" font-semibold text-2xl text-center">{title}</Text>

        <Text className="text-sm text-gray-500 text-center mt-2 ">
          {description}
        </Text>
      </View>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="general-info" options={{ headerShown: false }} />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen name="phone-number" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default OnboardingLayout;
