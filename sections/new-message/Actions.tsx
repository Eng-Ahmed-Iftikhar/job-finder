import React from "react";
import { Pressable } from "react-native";
import { View } from "react-native";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#1eadff";

function Actions() {
  return (
    <View className="px-4 py-3 bg-white border-t border-gray-200">
      <View className="flex-row items-center gap-2 mb-2">
        <Pressable className="p-2">
          <Ionicons name="attach" size={20} color="#6B7280" />
        </Pressable>
        <Pressable className="p-2">
          <Ionicons name="image" size={20} color="#6B7280" />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-base text-gray-900 border border-gray-200"
          placeholder="Type a message"
          placeholderTextColor="#9CA3AF"
        />
        <Pressable className="p-2">
          <Ionicons name="send" size={20} color={ACCENT} />
        </Pressable>
      </View>
    </View>
  );
}

export default Actions;
