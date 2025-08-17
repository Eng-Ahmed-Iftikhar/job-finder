import { useUser } from "@/hooks/useUser";
import { UserProfile } from "@/types/api/auth";
import {
  OnboardingSteps,
  OnboardingContextType,
  StepHeaderType,
} from "@/types/onboarding";
import { determineCurrentStep, getPreviousStep } from "@/utils";
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const onboardingContext = createContext<OnboardingContextType>({
  userProfile: null,
  handleUserProfile: () => {},
  handleClearUserProfile: () => {},
  onboardingSteps: [],
  handleChangeCurrentStep: () => {},
  handleChangeStepHeader: () => {},
  handleGoBack: () => {},
  currentStep: "",
  stepHeader: undefined,
});

const Provider = onboardingContext.Provider;

function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<string>(
    OnboardingSteps.GENERAL_INFO
  );
  const [stepHeader, setStepHeader] = useState<StepHeaderType>({
    title:
      "Welcome to Job finder! Let's take a few steps to complete your profile.",
    description: "First, please enter your name",
  });

  const router = useRouter();

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

  const handleGoBack = useCallback(() => {
    const previousStep = getPreviousStep(currentStep as OnboardingSteps);
    if (previousStep !== currentStep) {
      setCurrentStep(previousStep);
      // The useEffect will handle the redirect and header update
    }
  }, [currentStep]);

  // Function to determine which step should be current based on profile data
  const getCurrentStepFromProfile = useCallback(
    (profile: UserProfile): string => {
      return determineCurrentStep(profile);
    },
    []
  );

  useEffect(() => {
    if (user) {
      const profile = user.profile;
      if (profile) {
        handleUserProfile({
          generalInfo: profile.generalInfo,
          location: profile.location,
          phoneNumber: profile.phoneNumber,
          pictureUrl: profile.pictureUrl,
          resumeUrl: profile.resumeUrl,
        });

        // Set current step based on profile completion
        const currentStepFromProfile = getCurrentStepFromProfile(profile);
        setCurrentStep(currentStepFromProfile);

        console.log(
          "Profile loaded, current step set to:",
          currentStepFromProfile
        );
      }
    }
  }, [user, handleUserProfile, getCurrentStepFromProfile]);

  // Auto-redirect and set headers based on current step
  useEffect(() => {
    if (!currentStep) return;

    // Set step header based on current step
    switch (currentStep) {
      case OnboardingSteps.GENERAL_INFO:
        handleChangeStepHeader({
          title:
            "Welcome to Job finder! Let's take a few steps to complete your profile.",
          description: "First, please enter your name",
        });
        // Redirect to general info page
        router.replace("/(onboarding)/general-info");
        break;

      case OnboardingSteps.LOCATION:
        handleChangeStepHeader({
          title: "Enter your location",
          description:
            "We will display the most relevant jobs based on your location.",
        });
        // Redirect to location page
        router.replace("/(onboarding)/location");
        break;

      case OnboardingSteps.PHONE_NUMBER:
        handleChangeStepHeader({
          title: "Enter your phone number",
          description:
            "Phone number will help protect your account as well as let employers contact you much easier.",
        });
        // Redirect to phone number page
        router.replace("/(onboarding)/phone-number");
        break;

      case OnboardingSteps.PHONE_VERIFICATION:
        handleChangeStepHeader({
          title: "Phone verification",
          description: "Your phone number has been verified successfully!",
        });
        // Redirect to phone verification page
        router.replace("/(onboarding)/phone-verification");
        break;

      case OnboardingSteps.PICTURE_URL:
        handleChangeStepHeader({
          title: "Upload your profile picture",
          description: "A professional photo helps employers recognize you.",
        });
        // Redirect to profile image page
        router.replace("/(onboarding)/profile-image");
        break;

      case OnboardingSteps.RESUME_URL:
        handleChangeStepHeader({
          title: "Upload your resume",
          description: "STEP 5/5",
        });
        // Redirect to upload CV page
        router.replace("/(onboarding)/upload-cv");
        break;

      default:
        break;
    }
  }, [currentStep, handleChangeStepHeader, router]);

  return (
    <Provider
      value={{
        userProfile,
        currentStep,
        handleUserProfile,
        handleClearUserProfile,
        handleChangeCurrentStep,
        handleChangeStepHeader,
        handleGoBack,
        stepHeader,
        onboardingSteps: Object.values(OnboardingSteps),
      }}
    >
      {children}
    </Provider>
  );
}

export default OnboardingProvider;
