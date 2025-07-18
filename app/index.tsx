import AppLoader from "@/components/AppLoader";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectAuth } from "@/store/reducers/authSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";

function App() {
  const { isLoggedIn } = useAppSelector(selectAuth);
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("(dashboard)");
    } else {
      router.replace("/(auth)");
    }
  }, []);
  return <AppLoader />;
}

export default App;
