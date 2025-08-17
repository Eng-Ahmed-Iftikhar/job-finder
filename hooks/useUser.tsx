import { useAppSelector } from "./useAppSelector";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  selectIsLoggedIn,
} from "@/store/reducers/userSlice";

export function useUser() {
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
  };
}
