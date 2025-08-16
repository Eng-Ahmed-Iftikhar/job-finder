import OnboardingProvider from "@/context/OnboardingContext";
import OnboardingLayout from "@/sections/onboarding/OnboardingLayout";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";

function Layout() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector(selectAuth);

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
