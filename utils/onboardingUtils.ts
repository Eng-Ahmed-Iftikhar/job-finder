import { UserProfile } from "@/types/api/auth";
import { OnboardingSteps } from "@/types/onboarding";

// Utility function to check step completion status
export const checkStepCompletion = (
  profile: UserProfile | null,
  step: OnboardingSteps
): boolean => {
  if (!profile) return false;

  switch (step) {
    case OnboardingSteps.GENERAL_INFO:
      return !!(
        profile.generalInfo?.firstName && profile.generalInfo?.lastName
      );

    case OnboardingSteps.LOCATION:
      return !!(
        profile.location?.country &&
        profile.location?.city &&
        profile.location?.state &&
        profile.location?.address
      );

    case OnboardingSteps.PHONE_NUMBER:
      return !!(profile.phoneNumber?.number && profile.phoneNumber?.isVerified);

    case OnboardingSteps.PICTURE_URL:
      return !!profile.pictureUrl;

    case OnboardingSteps.RESUME_URL:
      return !!profile.resumeUrl;

    default:
      return false;
  }
};

// Utility function to get the next incomplete step
export const getNextIncompleteStep = (
  profile: UserProfile | null
): OnboardingSteps => {
  if (!profile) return OnboardingSteps.GENERAL_INFO;

  if (!checkStepCompletion(profile, OnboardingSteps.GENERAL_INFO)) {
    return OnboardingSteps.GENERAL_INFO;
  }

  if (!checkStepCompletion(profile, OnboardingSteps.LOCATION)) {
    return OnboardingSteps.LOCATION;
  }

  if (!checkStepCompletion(profile, OnboardingSteps.PHONE_NUMBER)) {
    return OnboardingSteps.PHONE_NUMBER;
  }

  if (!checkStepCompletion(profile, OnboardingSteps.PICTURE_URL)) {
    return OnboardingSteps.PICTURE_URL;
  }

  if (!checkStepCompletion(profile, OnboardingSteps.RESUME_URL)) {
    return OnboardingSteps.RESUME_URL;
  }

  // All steps completed
  return OnboardingSteps.RESUME_URL;
};

// Utility function to get the previous step
export const getPreviousStep = (
  currentStep: OnboardingSteps
): OnboardingSteps => {
  switch (currentStep) {
    case OnboardingSteps.GENERAL_INFO:
      return OnboardingSteps.GENERAL_INFO; // No previous step
    case OnboardingSteps.LOCATION:
      return OnboardingSteps.GENERAL_INFO;
    case OnboardingSteps.PHONE_NUMBER:
      return OnboardingSteps.LOCATION;
    case OnboardingSteps.PHONE_VERIFICATION:
      return OnboardingSteps.PHONE_NUMBER;
    case OnboardingSteps.PICTURE_URL:
      return OnboardingSteps.PHONE_VERIFICATION;
    case OnboardingSteps.RESUME_URL:
      return OnboardingSteps.PICTURE_URL;
    default:
      return OnboardingSteps.GENERAL_INFO;
  }
};

// Utility function to determine which step should be current based on profile data
export const determineCurrentStep = (profile: UserProfile | null): string => {
  return getNextIncompleteStep(profile);
};

// Utility function to get step progress percentage
export const getStepProgress = (profile: UserProfile | null): number => {
  if (!profile) return 0;

  const totalSteps = Object.keys(OnboardingSteps).length;
  let completedSteps = 0;

  if (checkStepCompletion(profile, OnboardingSteps.GENERAL_INFO))
    completedSteps++;
  if (checkStepCompletion(profile, OnboardingSteps.LOCATION)) completedSteps++;
  if (checkStepCompletion(profile, OnboardingSteps.PHONE_NUMBER))
    completedSteps++;
  if (checkStepCompletion(profile, OnboardingSteps.PICTURE_URL))
    completedSteps++;
  if (checkStepCompletion(profile, OnboardingSteps.RESUME_URL))
    completedSteps++;

  return Math.round((completedSteps / totalSteps) * 100);
};

// Utility function to check if onboarding is complete
export const isOnboardingComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;

  return getStepProgress(profile) === 100;
};
