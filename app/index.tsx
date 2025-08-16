import AppLoader from "@/components/AppLoader";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useRouter } from "expo-router";
import { useEffect } from "react";

function App() {
  const { isLoggedIn, user } = useAppSelector(selectAuth);
  const {
    isLoading: isAuthLoading,
    isInitialized,
    shouldFetchUser,
  } = useAuthInit();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth initialization to complete
    if (!isInitialized) {
      console.log("App: Waiting for auth initialization...");
      return;
    }

    // If we have a token but no user data yet, keep showing loader
    if (shouldFetchUser && !user) {
      console.log("App: Token exists but no user data yet, waiting...");
      return;
    }

    if (isLoggedIn && user) {
      console.log("App: User is logged in, redirecting to dashboard");
      // Check if user has completed onboarding (you can add a field like hasCompletedOnboarding to your User type)
      // For now, we'll assume all logged-in users go to dashboard
      // You can modify this logic based on your onboarding requirements
      router.replace("/(dashboard)");
    } else {
      console.log("App: User is not logged in, redirecting to auth");
      router.replace("/(auth)");
    }
  }, [isLoggedIn, user, isInitialized, shouldFetchUser, router]);

  // Show loader while auth is initializing or fetching user data
  if (!isInitialized || isAuthLoading || (shouldFetchUser && !user)) {
    return <AppLoader />;
  }

  return <AppLoader />;
}

export default App;
