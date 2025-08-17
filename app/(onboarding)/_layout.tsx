import OnboardingProvider from "@/context/OnboardingContext";
import { useUser } from "@/hooks/useUser";
import OnboardingLayout from "@/sections/onboarding/OnboardingLayout";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

function Layout() {
  const router = useRouter();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(auth)/");
    }
  }, [isLoggedIn, router]);

  return (
    <OnboardingProvider>
      <OnboardingLayout />
    </OnboardingProvider>
  );
}

export default Layout;
