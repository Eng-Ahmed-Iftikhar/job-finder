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
  currentStep: string;
};

export const onboardingContext = createContext<OnboardingContextType>({
  userProfile: null,
  handleUserProfile: () => {},
  handleClearUserProfile: () => {},
  onboardingSteps: [],
  handleChangeCurrentStep: () => {},
  currentStep: "",
});
const Provider = onboardingContext.Provider;

function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<string>(
    OnboardingSteps.GENERAL_INFO
  );

  const handleUserProfile = useCallback((profile: UserProfile) => {
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

  return (
    <Provider
      value={{
        userProfile,
        currentStep,
        handleUserProfile,
        handleClearUserProfile,
        handleChangeCurrentStep,
        onboardingSteps: Object.values(OnboardingSteps),
      }}
    >
      {children}
    </Provider>
  );
}

export default OnboardingProvider;
