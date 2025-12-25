import { useGetChatsQuery } from "@/api/services/chatApi";
import SearchInput from "@/components/ui/SearchInput";
import { useAppSelector } from "@/hooks/useAppSelector";
import ConversationRow from "@/sections/messages/ConversationRow";
import EmptyMessages from "@/sections/messages/EmptyMessages";
import MessagesHeader from "@/sections/messages/MessagesHeader";
import { selectChats } from "@/store/reducers/chatSlice";
import { ConversationListItem } from "@/types/api/message";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

const conversationsData: ConversationListItem[] = [
  {
    id: "1",
    name: "Jimmy White",
    avatar: "JW",
    color: "#3b82f6",
    lastMessage: "Hey man how are you?",
    timestamp: "now",
    icon: "person",
  },
  {
    id: "2",
    name: "Jimmy White",
    avatar: "JW",
    color: "#3b82f6",
    lastMessage: "Hey man how are you?",
    timestamp: "now",
    icon: "person",
  },
];

let PAGE_SIZE = 20;
function MessagesScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const chats = useAppSelector(selectChats);
  const [page, setPage] = useState(1);

  const { data: conversationsDataResponse } = useGetChatsQuery({
    page,
    pageSize: PAGE_SIZE,
    search,
  });

  const onSelectConversation = (conversationId: string) => {
    // Handle conversation selection
  };
  const handleReachedEnd = () => {
    if (
      conversationsDataResponse &&
      conversationsDataResponse.data.chats?.length
    ) {
      setPage(page + 1);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <MessagesHeader />

      <View className="px-4 py-3 ">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationRow item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleReachedEnd}
        ListEmptyComponent={<EmptyMessages />}
      />
    </View>
  );
}

export default MessagesScreen;
