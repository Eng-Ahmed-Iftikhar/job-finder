import { useEffect } from "react";
import { useRouter } from "expo-router";
import AppLoader from "@/components/AppLoader";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(dashboard)/(tabs)/jobs");
  }, [router]);

  return <AppLoader />;
}
