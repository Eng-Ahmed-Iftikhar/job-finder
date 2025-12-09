import { useUser } from "@/hooks/useUser";
import VerifyEmailScreen from "@/screens/auth/VerifyEmail";
import { useRouter } from "expo-router";
import React from "react";

function VerifyEmail() {
  const router = useRouter();
  const { isLoggedIn, user } = useUser();
  React.useEffect(() => {
    if (user && user.profile && user.profile.isEmailVerified) {
      router.replace("/(dashboard)/");
    }
  }, [isLoggedIn, user, router]);
  return <VerifyEmailScreen />;
}

export default VerifyEmail;
