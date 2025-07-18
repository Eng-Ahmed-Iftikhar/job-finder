import OnboardingProvider from "@/context/OnboardingContext";
import OnboardingLayout from "@/sections/onboarding/OnboardingLayout";
import React from "react";

function Layout() {
  return (
    <OnboardingProvider>
      <OnboardingLayout />
    </OnboardingProvider>
  );
}

export default Layout;
