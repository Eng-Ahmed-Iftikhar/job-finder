import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ConnectionAvatar({
  color,
  icon = "person",
}: {
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      className="w-11 h-11 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <Ionicons name={icon} size={22} color="white" />
    </View>
  );
}
