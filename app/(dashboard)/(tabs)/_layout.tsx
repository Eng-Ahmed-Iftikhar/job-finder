import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardTabsLayout() {
  return (
    <Tabs
      initialRouteName="jobs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1eadff",
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: "Connections",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
