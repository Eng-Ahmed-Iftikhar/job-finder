import React from "react";
import ProfileDetailContent from "@/sections/profile/ProfileDetailContent";
import { useLocalSearchParams } from "expo-router";

export default function ProfileDetailScreen() {
  const params = useLocalSearchParams();
  const userId = typeof params.id === "string" ? params.id : undefined;

  return <ProfileDetailContent userId={userId} />;
}
