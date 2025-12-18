import { useLazyMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import AppLoader from "./AppLoader";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { access_token } = useAppSelector((state) => state.auth);

  const [trigger, { isLoading, isFetching }] = useLazyMeQuery();

  useEffect(() => {
    if (access_token) {
      trigger();
    }
  }, [access_token, trigger]);

  const gettingUser = isLoading || isFetching;
  if (gettingUser) {
    return <AppLoader />;
  }

  return children;
}

export default AuthGuard;
