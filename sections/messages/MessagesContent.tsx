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

const ACCENT = "#1eadff";

type Message = {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
};

type ConversationListItem = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lastMessage: string;
  timestamp: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type ContactItem = {
  id: string;
  name: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type ScreenState = "list" | "newMessage" | "chat";

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

const contactsData: ContactItem[] = [
  { id: "1", name: "Jimmy White", color: "#3b82f6", icon: "person" },
  { id: "2", name: "Jimmy White", color: "#a855f7", icon: "person" },
  { id: "3", name: "Jimmy White", color: "#f59e0b", icon: "person" },
];

const chatMessagesData: Message[] = [
  {
    id: "1",
    text: "That's perfect for me",
    timestamp: "10:30",
    isOwn: false,
  },
  {
    id: "2",
    text: "Awesome! Let me schedule a job interview",
    timestamp: "10:31",
    isOwn: true,
  },
  {
    id: "3",
    text: "Job interview with Johnny's Best scheduled for 18 Jan, 5:15 PM",
    timestamp: "10:32",
    isOwn: true,
  },
  {
    id: "4",
    text: "Add to Google Calendar",
    timestamp: "10:32",
    isOwn: true,
  },
];

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

function ConversationRow({
  item,
  onPress,
}: {
  item: ConversationListItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar color={item.color} name={item.name} icon={item.icon} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text className="text-xs text-gray-400">{item.timestamp}</Text>
    </Pressable>
  );
}

function ContactSuggestItem({
  item,
  onPress,
}: {
  item: ContactItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar color={item.color} name={item.name} icon={item.icon} />
      <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
    </Pressable>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <View
      className={
        "px-4 py-3 rounded-2xl max-w-xs " +
        (message.isOwn
          ? "bg-azure-radiance-500 self-end mr-4"
          : "bg-gray-100 self-start ml-4")
      }
    >
      <Text
        className={
          "text-base " + (message.isOwn ? "text-white" : "text-gray-900")
        }
      >
        {message.text}
      </Text>
      <Text
        className={
          "text-xs mt-1 " + (message.isOwn ? "text-blue-100" : "text-gray-500")
        }
      >
        {message.timestamp}
      </Text>
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
      <Text className="text-sm font-semibold text-white">{name}</Text>
      <Pressable onPress={onRemove}>
        <Ionicons name="close" size={16} color="white" />
      </Pressable>
    </View>
  );
}

function MessagesListScreen({
  onNewMessage,
  onSelectConversation,
}: {
  onNewMessage: () => void;
  onSelectConversation: (id: string) => void;
}) {
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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">Messages</Text>
        <Pressable
          onPress={onNewMessage}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={28} color={ACCENT} />
        </Pressable>
      </View>

      <View className="px-4 py-3">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
        />
      </View>

      {filteredConversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={32}
              color="#9ca3af"
            />
          </View>
          <Text className="text-base font-semibold text-gray-900 mb-1 text-center">
            No messages yet
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-4">
            Click + icon to write a new message
          </Text>
        </View>
      ) : (
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
        />
      )}

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
    </View>
  );
}

function NewMessageScreen({
  onBack,
  onSelectContact,
}: {
  onBack: () => void;
  onSelectContact: (contact: ContactItem) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(
    () =>
      contactsData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <Pressable onPress={onBack} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">New message</Text>
      </View>

      <View className="px-4 py-3">
        <TextInput
          className="px-4 py-3 bg-white rounded-lg text-base text-gray-900 border-2 border-azure-radiance-500"
          placeholder="Type name of the user or business"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredContacts.length > 0 && (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactSuggestItem
              item={item}
              onPress={() => onSelectContact(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}

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
    </KeyboardAvoidingView>
  );
}

function ChatDetailScreen({
  selectedContact,
  onBack,
}: {
  selectedContact: ContactItem;
  onBack: () => void;
}) {
  const [messageInput, setMessageInput] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <Pressable onPress={onBack} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </Pressable>
        <Avatar
          color={selectedContact.color}
          name={selectedContact.name}
          icon={selectedContact.icon}
          size={36}
        />
        <Text className="text-base font-semibold text-gray-900">
          {selectedContact.name}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs font-semibold text-gray-400 text-center mb-4">
          16 JAN
        </Text>

        {chatMessagesData.map((msg) => (
          <View key={msg.id} className="mb-3">
            <MessageBubble message={msg} />
          </View>
        ))}

        {chatMessagesData.some((msg) =>
          msg.text.includes("Google Calendar")
        ) && (
          <View className="mt-4 px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
            <Text className="text-sm font-semibold text-emerald-700">
              Add to Google Calendar
            </Text>
          </View>
        )}
      </ScrollView>

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
            value={messageInput}
            onChangeText={setMessageInput}
          />
          <Pressable className="p-2">
            <Ionicons name="send" size={20} color={ACCENT} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function MessagesContent() {
  const [screen, setScreen] = useState<ScreenState>("list");
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null
  );

  const handleNewMessage = () => {
    setSelectedContact(null);
    setScreen("newMessage");
  };

  const handleSelectContact = (contact: ContactItem) => {
    setSelectedContact(contact);
    setScreen("chat");
  };

  const handleBackFromNewMessage = () => {
    setSelectedContact(null);
    setScreen("list");
  };

  const handleBackFromChat = () => {
    setSelectedContact(null);
    setScreen("list");
  };

  if (screen === "newMessage") {
    return (
      <NewMessageScreen
        onBack={handleBackFromNewMessage}
        onSelectContact={handleSelectContact}
      />
    );
  }

  if (screen === "chat" && selectedContact) {
    return (
      <ChatDetailScreen
        selectedContact={selectedContact}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <MessagesListScreen
      onNewMessage={handleNewMessage}
      onSelectConversation={() => {
        const contact = contactsData[0];
        setSelectedContact(contact);
        setScreen("chat");
      }}
    />
  );
}
