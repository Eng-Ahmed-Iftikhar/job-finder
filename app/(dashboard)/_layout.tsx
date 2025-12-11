import { useUser } from "@/hooks/useUser";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import DashboardHeader from "@/sections/dashboard/Header";

function DashboardLayout() {
  const router = useRouter();
  const { isLoggedIn, user } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(auth)/login");
    } else if (user && user.profile && !user.profile.isEmailVerified) {
      router.replace("/(profile)/verify-email");
    } else if (user && user.profile && !user.profile.isOnboarded) {
      router.replace("/(onboarding)/");
    }
  }, [isLoggedIn, user, router]);

  return (
    <>
      <DashboardHeader />
      <Slot />
    </>
  );
}

export default DashboardLayout;
