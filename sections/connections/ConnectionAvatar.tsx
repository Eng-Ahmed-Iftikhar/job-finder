import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

export function ConnectionAvatar({
  color,
  icon = "person",
  imgUrl,
}: {
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
  imgUrl?: string;
}) {
  return (
    <View
      className="w-11 h-11 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      {imgUrl ? (
        <Image
          source={{ uri: imgUrl }}
          style={{ width: 44, height: 44, borderRadius: 22 }}
        />
      ) : (
        <Ionicons name={icon} size={22} color="white" />
      )}
    </View>
  );
}
