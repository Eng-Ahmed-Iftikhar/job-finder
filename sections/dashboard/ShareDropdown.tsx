import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type ShareDropdownProps = {
  visible: boolean;
  jobUrl: string;
  onCopyLink: () => void;
  onShareFacebook: () => void;
  onShareTwitter: () => void;
  onShareEmail: () => void;
};

export default function ShareDropdown({
  visible,
  jobUrl,
  onCopyLink,
  onShareFacebook,
  onShareTwitter,
  onShareEmail,
}: ShareDropdownProps) {
  if (!visible) return null;

  return (
    <View
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      className="absolute top-0 -left-72 bg-white rounded-xl overflow-visible shadow-xl border border-gray-200 z-50 w-72 p-4"
    >
      <Text className="text-base text-gray-500 mb-3">Copy link to post</Text>

      {/* Link Copy Section */}
      <TouchableOpacity
        onPress={onCopyLink}
        className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 mb-4"
      >
        <Icon name="link-outline" size={20} color="#9CA3AF" />
        <Text className="flex-1 ml-3 text-sm text-gray-700" numberOfLines={1}>
          {jobUrl}
        </Text>
        <Icon name="copy-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Text className="text-base text-gray-500 mb-4">Or share via...</Text>

      {/* Social Share Buttons */}
      <View className="flex-row justify-around">
        <TouchableOpacity onPress={onShareFacebook} className="items-center">
          <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center">
            <Icon name="logo-facebook" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-xs text-gray-700 mt-1">Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShareTwitter} className="items-center">
          <View className="w-10 h-10 rounded-full bg-sky-500 items-center justify-center">
            <Icon name="logo-twitter" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-xs text-gray-700 mt-1">Twitter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShareEmail} className="items-center">
          <View className="w-10 h-10 rounded-full bg-gray-600 items-center justify-center">
            <Icon name="mail-outline" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-xs text-gray-700 mt-1">Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
