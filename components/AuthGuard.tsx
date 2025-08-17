import { useLazyMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [getMe] = useLazyMeQuery();

  const { access_token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch user data if we have a valid access token
    if (access_token) {
      getMe();
    }
  }, [access_token, getMe]);

  return children;
}

export default AuthGuard;
