import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ConnectionAvatar } from "./ConnectionAvatar";

const ACCENT = "#1eadff";

export type ConnectionItem = {
  id: string;
  name: string;
  location: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function ConnectionRow({ item }: { item: ConnectionItem }) {
  const handleMessage = () => {
    // Handle message action
  };

  const handleMenu = () => {
    // Handle menu action
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
          onPress={handleMessage}
          className="flex-row items-center px-3 py-2 rounded-lg border border-azure-radiance-500 bg-azure-radiance-50"
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={ACCENT}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm font-medium text-azure-radiance-600">
            Message
          </Text>
        </Pressable>

        <Pressable onPress={handleMenu} className="p-2">
          <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}
