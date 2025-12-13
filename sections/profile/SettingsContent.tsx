import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotificationSetting {
  id: string;
  label: string;
  system: boolean;
  email: boolean;
}

export default function SettingsContent() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "1",
      label: "Someone scheduled a job interview with me",
      system: true,
      email: true,
    },
    {
      id: "2",
      label: "Someone wants to connect",
      system: true,
      email: true,
    },
    {
      id: "3",
      label: "New job opening from the company I follow",
      system: true,
      email: true,
    },
    {
      id: "4",
      label: "Reminder about upcoming job interview",
      system: false,
      email: true,
    },
  ]);

  const toggleNotification = (id: string, type: "system" | "email") => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, [type]: !notif[type] } : notif
      )
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {/* Password Section */}
          <View className="mb-8">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Password
            </Text>
            <Pressable>
              <Text className="text-base font-semibold text-azure-radiance-500">
                Change password
              </Text>
            </Pressable>
          </View>

          {/* Notification Settings */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Notification settings
            </Text>

            {/* Table Header */}
            <View className="flex-row items-center mb-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 uppercase">
                  NOTIFICATION
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text className="text-xs font-semibold text-gray-500 uppercase">
                  SYSTEM
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text className="text-xs font-semibold text-gray-500 uppercase">
                  EMAIL
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {notifications.map((notification) => (
              <View
                key={notification.id}
                className="flex-row items-center py-4 border-b border-gray-100"
              >
                <View className="flex-1">
                  <Text className="text-sm text-gray-900">
                    {notification.label}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Pressable
                    onPress={() =>
                      toggleNotification(notification.id, "system")
                    }
                    className={`w-6 h-6 rounded items-center justify-center ${
                      notification.system
                        ? "bg-azure-radiance-500"
                        : "border-2 border-gray-300"
                    }`}
                  >
                    {notification.system && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </Pressable>
                </View>
                <View className="w-20 items-center">
                  <Pressable
                    onPress={() => toggleNotification(notification.id, "email")}
                    className={`w-6 h-6 rounded items-center justify-center ${
                      notification.email
                        ? "bg-azure-radiance-500"
                        : "border-2 border-gray-300"
                    }`}
                  >
                    {notification.email && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
