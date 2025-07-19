import AppLoader from "@/components/AppLoader";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(onboarding)");
  }, [router]);

  return <AppLoader />;
}

export default Dashboard;
