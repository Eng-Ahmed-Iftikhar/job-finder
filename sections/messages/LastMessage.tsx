import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessage,
} from "@/types/chat";
import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { selectUser } from "@/store/reducers/userSlice";
import { useAppSelector } from "@/hooks/useAppSelector";

function LastMessage({ lastMessage }: { lastMessage: ChatMessage }) {
  const user = useAppSelector(selectUser);

  if (!lastMessage) {
    return <Text>No messages yet.</Text>;
  }
  const isOwn = lastMessage.senderId === user?.id;

  const receivedUsers = lastMessage.userStatuses?.filter(
    (status) => status.receivedAt
  );
  const seenUsers = lastMessage.userStatuses?.filter((status) => status.seenAt);

  const isReceived =
    lastMessage?.userStatuses &&
    lastMessage.userStatuses?.length !== 0 &&
    receivedUsers?.length === lastMessage.userStatuses?.length;

  const isSeen =
    lastMessage?.userStatuses &&
    lastMessage.userStatuses?.length !== 0 &&
    seenUsers?.length === lastMessage.userStatuses?.length;

  const Icon = (
    <Ionicons
      name={
        lastMessage.status === CHAT_MESSAGE_STATUS.PENDING
          ? "time"
          : lastMessage.status === CHAT_MESSAGE_STATUS.SENT
            ? isReceived
              ? "checkmark-done"
              : "checkmark"
            : "checkmark"
      }
      size={16}
      className="mt-1"
      color={isSeen ? "#1eadff" : "#9CA3AF"}
    />
  );
  if (lastMessage.messageType === CHAT_MESSAGE_TYPE.TEXT) {
    return (
      <View className="flex-row items-center gap-2">
        {isOwn && Icon}
        <Text
          className="text-sm font-medium text-gray-500 mt-1"
          numberOfLines={1}
        >
          {lastMessage?.text || "No messages yet."}
        </Text>
      </View>
    );
  }
  if (lastMessage.messageType === CHAT_MESSAGE_TYPE.IMAGE) {
    return (
      <View className="flex-row items-center  gap-2">
        {isOwn && Icon}

        <Text className="text-sm font-medium text-gray-500 mt-1">📷 Photo</Text>
      </View>
    );
  }
  return (
    <View className="flex-row items-center gap-2">
      {isOwn && Icon}

      <Text className="text-sm font-medium text-gray-500 mt-1">📎 File</Text>
    </View>
  );
}

export default LastMessage;
