import Avatar from "@/components/ui/Avatar";
import useChat from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

function MessageDetailHeader() {
  const param = useLocalSearchParams();
  const router = useRouter();
  const id = typeof param.id === "string" ? param.id : "";
  const { chatName } = useChat(id);

  const handleBack = useCallback(() => {
    router.push("/messages");
  }, [router]);

  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
      <Pressable onPress={handleBack} className="p-2 -ml-2">
        <Ionicons name="chevron-back" size={24} color="#1F2937" />
      </Pressable>
      <Avatar name={chatName} size={36} />
      <Text className="text-base font-semibold text-gray-900">{chatName}</Text>
    </View>
  );
}

export default MessageDetailHeader;
