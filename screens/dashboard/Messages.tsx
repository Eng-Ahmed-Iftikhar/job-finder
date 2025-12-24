import SearchInput from "@/components/ui/SearchInput";
import ConversationRow from "@/sections/messages/ConversationRow";
import EmptyMessages from "@/sections/messages/EmptyMessages";
import MessagesHeader from "@/sections/messages/MessagesHeader";
import { ConversationListItem } from "@/types/api/message";
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

function MessagesScreen() {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(
    () =>
      conversationsData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.lastMessage.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const onSelectConversation = (conversationId: string) => {
    // Handle conversation selection
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
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow
            item={item}
            onPress={() => onSelectConversation(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyMessages />}
      />
    </View>
  );
}

export default MessagesScreen;
