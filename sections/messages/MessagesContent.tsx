import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchInput from "@/components/ui/SearchInput";
import { ContactItem } from "@/types/api/message";

const ACCENT = "#1eadff";

type ScreenState = "list" | "newMessage" | "chat";

function Avatar({
  color,
  name,
  icon = "person",
  size = 44,
}: {
  color: string;
  name: string;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
}) {
  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
    >
      <Ionicons name={icon} size={size * 0.5} color="white" />
    </View>
  );
}

function SelectedUserChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  return (
    <View className="flex-row items-center gap-2 px-3 py-2 rounded-full bg-emerald-500 self-flex-start">
      <Text className="text-sm font-medium font-semibold text-white">
        {name}
      </Text>
      <Pressable onPress={onRemove}>
        <Ionicons name="close" size={16} color="white" />
      </Pressable>
    </View>
  );
}
