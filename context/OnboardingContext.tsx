import { UserProfile } from "@/types/api/auth";
import React, { createContext, useCallback, useState } from "react";

export enum OnboardingSteps {
  GENERAL_INFO = "generalInfo",
  LOCATION = "location",
  PHONE_NUMBER = "phone_number",
  PICTURE_URL = "pictureUrl",
  RESUME_URL = "resumeUrl",
}

type OnboardingContextType = {
  userProfile: UserProfile | null;
  handleUserProfile: (profile: UserProfile) => void;
  handleClearUserProfile: () => void;
  onboardingSteps: string[];
  handleChangeCurrentStep: (step: string) => void;
  handleChangeStepHeader: (stepHeader: StepHeaderType) => void;
  currentStep: string;
  stepHeader?: StepHeaderType;
};

export const onboardingContext = createContext<OnboardingContextType>({
  userProfile: null,
  handleUserProfile: () => {},
  handleClearUserProfile: () => {},
  onboardingSteps: [],
  handleChangeCurrentStep: () => {},
  handleChangeStepHeader: () => {},
  currentStep: "",
  stepHeader: undefined,
});
const Provider = onboardingContext.Provider;
type StepHeaderType = {
  title: string;
  description: string;
};

function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [currentStep, setCurrentStep] = useState<string>(
    OnboardingSteps.GENERAL_INFO
  );
  const [stepHeader, setStepHeader] = useState<StepHeaderType>({
    title:
      "Welcome to Job finder! Let’s take a few steps to complete your profile.",
    description: "First, please enter your name",
  });

  const handleUserProfile = useCallback((profile: UserProfile) => {
    console.log({ profile });
    setUserProfile((prev) => {
      return {
        ...prev,
        ...profile,
      };
    });
  }, []);

  const handleClearUserProfile = useCallback(() => {
    setUserProfile(null);
  }, []);

  const handleChangeCurrentStep = useCallback((step: string) => {
    setCurrentStep(step);
  }, []);

  const handleChangeStepHeader = useCallback((stepHeader: StepHeaderType) => {
    setStepHeader((prev) => ({ ...prev, ...stepHeader }));
  }, []);

  return (
    <Provider
      value={{
        userProfile,
        currentStep,
        handleUserProfile,
        handleClearUserProfile,
        handleChangeCurrentStep,
        handleChangeStepHeader,
        stepHeader,
        onboardingSteps: Object.values(OnboardingSteps),
      }}
    >
      {children}
    </Provider>
  );
}

export default OnboardingProvider;
