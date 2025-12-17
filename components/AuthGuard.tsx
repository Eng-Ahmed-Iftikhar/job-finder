import { useMeQuery } from "@/api/services/authApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import AppLoader from "./AppLoader";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { access_token } = useAppSelector((state) => state.auth);

  const { isLoading, isFetching } = useMeQuery(undefined, {
    skip: !Boolean(access_token),
  });
  const gettingUser = isLoading || isFetching;

  if (gettingUser) {
    return <AppLoader />;
  }

  return children;
}

export default AuthGuard;
