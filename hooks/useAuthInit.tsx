import { useEffect } from "react";
import { useAppSelector } from "./useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";
import { useMeQuery } from "@/api/services/authApi";

export function useAuthInit() {
  const { access_token } = useAppSelector(selectAuth);

  // Always fetch user data if we have a token (since user and isLoggedIn are not persisted)
  const shouldFetchUser = !!access_token;

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useMeQuery(undefined, {
    skip: !shouldFetchUser, // Skip if no token
  });

  useEffect(() => {
    // If we have a token, fetch user data
    if (shouldFetchUser) {
      console.log("Auth init: Fetching user data with token");
      refetch();
    }
  }, [shouldFetchUser, refetch]);

  useEffect(() => {
    if (error) {
      console.error("Auth init error:", error);
    }
  }, [error]);

  return {
    isLoading,
    error,
    user,
    isInitialized: !shouldFetchUser || !isLoading,
    shouldFetchUser,
  };
}
