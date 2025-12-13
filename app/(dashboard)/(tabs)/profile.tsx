import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import EditProfileContent from "@/sections/profile/EditProfileContent";
import SettingsContent from "@/sections/profile/SettingsContent";

type TabKey = "edit-profile" | "settings";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("edit-profile");

  return (
    <View className="flex-1 bg-white">
      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 px-4">
        <Pressable
          onPress={() => setActiveTab("edit-profile")}
          className="mr-6 py-3"
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === "edit-profile"
                ? "text-azure-radiance-500"
                : "text-gray-500"
            }`}
          >
            Edit profile
          </Text>
          {activeTab === "edit-profile" && (
            <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
          )}
        </Pressable>

        <Pressable onPress={() => setActiveTab("settings")} className="py-3">
          <Text
            className={`text-sm font-semibold ${
              activeTab === "settings"
                ? "text-azure-radiance-500"
                : "text-gray-500"
            }`}
          >
            Settings
          </Text>
          {activeTab === "settings" && (
            <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
          )}
        </Pressable>
      </View>

      {/* Page Title */}
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">
          {activeTab === "edit-profile" ? "Edit profile" : "Settings"}
        </Text>
      </View>

      {/* Content */}
      {activeTab === "edit-profile" ? (
        <EditProfileContent />
      ) : (
        <SettingsContent />
      )}
    </View>
  );
}
