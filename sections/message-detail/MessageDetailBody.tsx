import {
  useGetChatMessagesQuery,
  useGetChatQuery,
} from "@/api/services/chatApi";
import useChat from "@/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  Text,
  View,
} from "react-native";
import MessageBubble from "./MessageBubble";

import AppLoader from "@/components/AppLoader";
import { formatMessagesByDate } from "@/utils/chat";

const PAGE_SIZE = 20;
const MessageDetailBody = () => {
  const param = useLocalSearchParams();
  const id = typeof param.id === "string" ? param.id : "";
  const { chatMessages = [], chat } = useChat(id);

  const { isLoading } = useGetChatQuery(id, {
    skip: chat ? true : false,
    refetchOnMountOrArgChange: true,
  });

  const messagesByDate = React.useMemo(
    () => formatMessagesByDate(chatMessages),
    [chatMessages]
  );
  const [page, setPage] = useState<number>(1);
  const flatListRef = useRef<FlatList>(null);

  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetChatMessagesQuery(
      {
        id,
        params: { page, pageSize: PAGE_SIZE },
      },
      { skip: chat ? false : true }
    );
  const messages = messagesData?.data || [];
  const totalMessages = messagesData?.total || 0;

  // Handler for when user scrolls to the top (onEndReached for inverted FlatList)
  const handleEndReached = useCallback(() => {
    if (messages.length && messages.length < totalMessages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [messages, totalMessages]);
  // Scroll to bottom when messagesByDate changes (new message)
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 999999, animated: true });
      }, 100);
    }
  }, [messagesByDate]);

  if (isLoading) {
    return (
      <View className="flex-1 relative justify-center items-center">
        <AppLoader />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      {isMessagesLoading && (
        <View className="flex-row items-center justify-center py-2 gap-3">
          <ActivityIndicator />
          <Text className="text-center text-gray-500 py-2">
            Loading new messages...
          </Text>
        </View>
      )}
      <SectionList
        className="flex-1"
        sections={messagesByDate
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((group) => ({
            title: new Date(group.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            data: group.messages,
          }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        renderSectionFooter={({ section: { title } }) => (
          <Text className="text-sm font-medium text-gray-400 text-center mb-4 mt-10">
            {title}
          </Text>
        )}
        inverted
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default MessageDetailBody;
