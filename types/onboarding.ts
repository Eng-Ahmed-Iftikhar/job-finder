export enum OnboardingSteps {
  GENERAL_INFO = "generalInfo",
  LOCATION = "location",
  PHONE_NUMBER = "phone_number",
  PHONE_VERIFICATION = "phone_verification",
  PICTURE_URL = "pictureUrl",
  RESUME_URL = "resumeUrl",
  GENERIC_APPLICATION = "generic_application",
}

export type StepHeaderType = {
  title: string;
  description: string;
};

export type OnboardingContextType = {
  userProfile: UserProfile | null;
  handleUserProfile: (profile: UserProfile) => void;
  handleClearUserProfile: () => void;
  onboardingSteps: string[];
  handleChangeCurrentStep: (step: string) => void;
  handleChangeStepHeader: (stepHeader: StepHeaderType) => void;
  handleGoBack: () => void;
  currentStep: string;
  stepHeader?: StepHeaderType;
};

// Import UserProfile from auth types
import { UserProfile } from "./api/auth";
