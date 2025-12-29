import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import useChat from "@/hooks/useChat";
import { Chat } from "@/types/chat";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import LastMessage from "./LastMessage";
import moment from "moment";

function ConversationRow({ item }: { item: Chat }) {
  const {
    chat,
    chatName,
    chatIconUrl,
    unreedMessagesCount = 0,
  } = useChat(item?.id);
  const router = useRouter();

  const chatMessages =
    chat?.messagesWithDates?.flatMap((section) => section.data) || [];
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
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-semibold text-gray-900">
            {chatName}
          </Text>
          {unreedMessagesCount > 0 && <Badge count={unreedMessagesCount} />}
        </View>

        <LastMessage chatId={item?.id} lastMessage={lastMessage} />
      </View>
      <Text className="text-sm font-medium text-gray-400">
        {lastMessage ? moment(lastMessage.createdAt).format("hh:mm A") : ""}
      </Text>
    </Pressable>
  );
}

export default ConversationRow;
