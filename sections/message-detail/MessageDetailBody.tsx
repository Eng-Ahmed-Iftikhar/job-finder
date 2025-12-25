import { useGetChatMessagesQuery } from "@/api/services/chatApi";
import useChat from "@/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import MessageBubble from "./MessageBubble";

const PAGE_SIZE = 20;
const MessageDetailBody = () => {
  const param = useLocalSearchParams();
  const id = typeof param.id === "string" ? param.id : "";
  const { messagesByDate = [] } = useChat(id);

  const [page, setPage] = useState<number>(1);
  const flatListRef = useRef<FlatList>(null);

  const { data: messagesData } = useGetChatMessagesQuery({
    id,
    params: { page, pageSize: PAGE_SIZE },
  });
  const messages = messagesData?.data || [];
  const totalMessages = messagesData?.total || 0;
  const messagesPage = messagesData?.page || 1;

  // Handler for when user scrolls to the top (onEndReached for inverted FlatList)
  const handleEndReached = () => {
    if (
      messages.length &&
      messages.length < totalMessages &&
      messagesPage === page
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        className="  px-4 py-4 "
        data={messagesByDate}
        scrollEnabled
        keyExtractor={(item) => item.date.toDateString()}
        renderItem={({ item }) => (
          <View className="mb-3">
            <Text className="text-sm font-medium  text-gray-400 text-center mb-4">
              {new Date(item.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            {item.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </View>
        )}
        inverted
        showsVerticalScrollIndicator={false}
        //   contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default MessageDetailBody;
