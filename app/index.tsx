import AppLoader from "@/components/AppLoader";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { useEffect } from "react";

function App() {
  const router = useRouter();

  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (isLoggedIn) {
      // User is logged in and user data is available
      router.replace("/(dashboard)");
    } else if (!isLoggedIn) {
      // No token or not logged in, redirect to auth
      router.replace("/(auth)");
    }
  }, [isLoggedIn, router]);

  return <AppLoader />;
}

export default App;
