import { useUser } from "@/hooks/useUser";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import DashboardHeader from "@/sections/dashboard/Header";
import { SearchProvider } from "@/contexts/SearchContext";

function DashboardLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn, user } = useUser();

  // Check if current route is search page (not search-suggestions)
  const isSearchPage =
    segments.includes("search") && !segments.includes("search-suggestions");

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
    <SearchProvider>
      {!isSearchPage && <DashboardHeader />}
      <Slot />
    </SearchProvider>
  );
}

export default DashboardLayout;
