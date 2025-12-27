import { useLazyMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import AppLoader from "./AppLoader";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { access_token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [trigger, { isLoading, isFetching }] = useLazyMeQuery();

  useEffect(() => {
    if (access_token) {
      trigger();
      dispatch({ type: "socket/connect" });
    }
  }, [access_token, trigger]);

  const gettingUser = isLoading || isFetching;
  if (gettingUser) {
    return <AppLoader />;
  }

  return children;
}

export default AuthGuard;
