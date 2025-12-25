import Avatar from "@/components/ui/Avatar";
import useChat from "@/hooks/useChat";
import { Chat } from "@/types/chat";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

function ConversationRow({ item }: { item: Chat }) {
  const { chatMessages: messages, chatName, chatIconUrl } = useChat(item.id);
  const router = useRouter();

  const chatMessages = messages.filter((message) => message.chatId === item.id);
  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastMessage = sortedMessages[sortedMessages.length - 1];

  const handlePress = () => {
    router.push({
      pathname: "/messages/chat",
      params: { id: item.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar name={chatName} imageUrl={chatIconUrl} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {chatName}
        </Text>
        <Text
          className="text-sm font-medium text-gray-500 mt-1"
          numberOfLines={1}
        >
          {lastMessage?.text || "No messages yet."}
        </Text>
      </View>
      <Text className="text-sm font-medium text-gray-400">
        {lastMessage
          ? new Date(lastMessage.createdAt).toLocaleTimeString()
          : ""}
      </Text>
    </Pressable>
  );
}

export default ConversationRow;
