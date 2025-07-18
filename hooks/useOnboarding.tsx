import { onboardingContext } from "@/context/OnboardingContext";
import { useContext } from "react";

export default function useOnboarding() {
  return useContext(onboardingContext);
}
