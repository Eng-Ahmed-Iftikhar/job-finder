import React, { useState } from "react";
import { Text, TouchableOpacity, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import Avatar from "@/components/ui/Avatar";

export interface FollowedCompany {
  id: string;
  name: string;
  address?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  pictureUrl?: string;
}

interface FollowRowProps {
  item: FollowedCompany;
}

export function FollowRow({ item }: FollowRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handlePress = () => {
    // Navigate to company detail
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const locationText =
    item.location?.city && item.location?.state
      ? `${item.location.city}, ${item.location.state}`
      : item.address || "";

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center px-4 py-3 bg-white"
      activeOpacity={0.7}
    >
      <View className="mr-3">
        {item.pictureUrl ? (
          <Avatar imageUrl={item.pictureUrl} size={48} />
        ) : (
          <View className="w-12 h-12 rounded-full bg-azure-radiance-500 items-center justify-center">
            <Ionicons name="business" size={24} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.name}
        </Text>
        {locationText && (
          <Text className="text-sm text-gray-600 mt-0.5">{locationText}</Text>
        )}
      </View>

      <Pressable onPress={handleMenu} className="p-2">
        <Icon name="ellipsis-vertical" size={20} color="#6B7280" />
      </Pressable>
    </TouchableOpacity>
  );
}
