import { SearchProvider } from "@/contexts/SearchContext";
import { useUser } from "@/hooks/useUser";
import DashboardHeader from "@/sections/dashboard/Header";
import { Redirect, Slot, useSegments } from "expo-router";
import React from "react";

function DashboardLayout() {
  const segments = useSegments();
  const { isLoggedIn, user } = useUser();

  // Check if current route is search page (not search-suggestions)
  const isSearchPage =
    segments.includes("search") && !segments.includes("search-suggestions");

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  } else if (user && !user.email.isVerified) {
    return <Redirect href="/(profile)/verify-email" />;
  } else if (user && user.profile && !user.profile.isOnboarded) {
    return <Redirect href="/(onboarding)/" />;
  }

  return (
    <SearchProvider>
      {!isSearchPage && <DashboardHeader />}
      <Slot />
    </SearchProvider>
  );
}

export default DashboardLayout;
