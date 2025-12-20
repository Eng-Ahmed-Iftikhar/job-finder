import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ConnectionAvatar } from "./ConnectionAvatar";
import { Text } from "react-native";

export type PendingItem = {
  id: string;
  name: string;
  location: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function PendingRow({ item }: { item: PendingItem }) {
  const handleAccept = () => {
    // Handle accept action
  };

  const handleReject = () => {
    // Handle reject action
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center gap-3 flex-1">
        <ConnectionAvatar color={item.color} icon={item.icon} />
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm font-medium text-gray-500" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={handleAccept}
          className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center"
        >
          <Ionicons name="checkmark" size={18} color="#16a34a" />
        </Pressable>
        <Pressable
          onPress={handleReject}
          className="w-9 h-9 rounded-full bg-red-100 items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}
