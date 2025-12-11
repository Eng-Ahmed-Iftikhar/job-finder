import React from "react";
import { Slot, usePathname, useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";

const tabs = [
  { name: "Suggested jobs", route: "/(dashboard)/(tabs)/jobs", label: "/jobs" },
  {
    name: "Applied",
    route: "/(dashboard)/(tabs)/jobs/applied",
    label: "/jobs/applied",
  },
  {
    name: "Saved",
    route: "/(dashboard)/(tabs)/jobs/saved",
    label: "/jobs/saved",
  },
];

export default function JobsTopTabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-row px-4 pt-3 bg-white border-b border-gray-200 gap-6">
        {tabs.map((tab) => {
          const active = pathname === tab.label;
          return (
            <TouchableOpacity
              key={tab.route}
              className="items-center "
              onPress={() => router.replace(tab.route)}
            >
              <Text
                className={`text-sm font-medium ${
                  active ? "text-azure-radiance-500" : "text-gray-500"
                }`}
              >
                {tab.name}
              </Text>
              <View
                className={`h-0.5 w-full mt-2 ${
                  active ? "bg-azure-radiance-500" : "bg-transparent"
                }`}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Slot />
    </View>
  );
}
