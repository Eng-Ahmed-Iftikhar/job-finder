import { useCreateChatMessageMutation } from "@/api/services/chatApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import { updateMessage } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { CHAT_MESSAGE_STATUS, ChatMessage } from "@/types/chat";
import { useCallback, useEffect } from "react";
import { Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const user = useAppSelector(selectUser);
  const { chatUsers = [] } = useChat(message?.chatId || "");
  const dispatch = useAppDispatch();
  const [createMessage] = useCreateChatMessageMutation();
  const chatUser = chatUsers.find((user) => user.userId === message.senderId);
  const isOwn = message.senderId === user?.id;
  const pictureUrl = chatUser?.user.profile.pictureUrl || "";

  const handleCreateMessage = useCallback(async () => {
    if (message.status !== CHAT_MESSAGE_STATUS.PENDING) return;
    const result = await createMessage({
      id: message.chatId,
      body: {
        senderId: message.senderId,
        text: message.text || "",
        messageType: message.messageType,
      },
    }).unwrap();
    dispatch(updateMessage({ id: message.id, message: result }));

    return result;
  }, [message, createMessage]);

  useEffect(() => {
    handleCreateMessage();
  }, [handleCreateMessage]);

  return (
    <View
      style={{
        marginBottom: 12,
        gap: 8,
        flexDirection: isOwn ? "row-reverse" : "row",
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: pictureUrl }}
        style={{ width: 32, height: 32, borderRadius: 16, marginHorizontal: 4 }}
      />
      {/* Message bubble */}
      <View>
        <View
          className={
            "px-4 py-3 rounded-2xl max-w-xs " +
            (isOwn
              ? "bg-azure-radiance-500 self-end "
              : "bg-gray-100 self-start ")
          }
        >
          <Text
            className={"text-base " + (isOwn ? "text-white" : "text-gray-900")}
          >
            {message.text}
          </Text>
        </View>
        <View
          className={
            `gap-3 flex-row items-center mt-2 ` +
            (isOwn ? "justify-end" : "justify-start")
          }
        >
          <Text className={"text-sm font-medium " + "text-gray-500"}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {/* Seen double tick for own messages */}
          {isOwn && (
            <View>
              {message.status === CHAT_MESSAGE_STATUS.PENDING ? (
                <Ionicons name="time" size={14} color="#6B7280" />
              ) : message.status === CHAT_MESSAGE_STATUS.SENT ? (
                <Ionicons name="checkmark-done" size={14} color="#6B7280" />
              ) : (
                <Ionicons name="checkmark-done" size={14} color="#1eadff" />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
