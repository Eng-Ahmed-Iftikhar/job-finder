import Avatar from "@/components/ui/Avatar";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { ContactItem, Message } from "@/types/api/message";
import MessageBubble from "@/sections/message-detail/MessageBubble";

const ACCENT = "#1eadff";

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

function ChatDetailScreen() {
  const [selectedContact] = useState<ContactItem>(chatMessagesData[0] as any);
  const [messageInput, setMessageInput] = useState("");

  const onBack = () => {
    // Handle back action
  };

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
          name={
            selectedContact.user?.firstName +
            " " +
            selectedContact.user?.lastName
          }
          size={36}
        />
        <Text className="text-base font-semibold text-gray-900">
          {selectedContact.user?.firstName +
            " " +
            selectedContact.user?.lastName}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-medium  text-gray-400 text-center mb-4">
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
            <Text className="text-sm font-medium  text-emerald-700">
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

export default ChatDetailScreen;
