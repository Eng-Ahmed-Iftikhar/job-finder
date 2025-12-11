import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type OptionsDropdownProps = {
  visible: boolean;
  onSave: () => void;
  onShare: () => void;
};

export default function OptionsDropdown({
  visible,
  onSave,
  onShare,
}: OptionsDropdownProps) {
  if (!visible) return null;

  return (
    <View
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      className="absolute top-4 -left-44 bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 z-50 w-44"
    >
      <TouchableOpacity
        onPress={onSave}
        className="flex-row items-center px-6 py-4 border-b border-gray-200"
      >
        <Icon name="bookmark-outline" size={22} color="#4B5563" />
        <Text className="ml-4 text-base text-gray-800">Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShare}
        className="flex-row items-center px-6 py-4"
      >
        <Icon name="share-social-outline" size={22} color="#4B5563" />
        <Text className="ml-4 text-base text-gray-800">Share</Text>
      </TouchableOpacity>
    </View>
  );
}
