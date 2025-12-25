import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import MessageDetailBody from "@/sections/message-detail/MessageDetailBody";
import MessageDetailHeader from "@/sections/message-detail/MessageDetailHeader";
import SendActions from "@/sections/new-message/SendActions";
import { addMessage } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessage,
} from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";

function ChatDetailScreen() {
  const param = useLocalSearchParams();
  const user = useAppSelector(selectUser);
  const id = typeof param.id === "string" ? param.id : "";
  const dispatch = useAppDispatch();

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text,
      messageType: CHAT_MESSAGE_TYPE.TEXT,
      createdAt: new Date(),
      status: CHAT_MESSAGE_STATUS.PENDING,
      chatId: id,
      senderId: user?.id || "",
    };
    dispatch(addMessage(newMessage));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <MessageDetailHeader />
      <MessageDetailBody />
      <SendActions onSendMessage={handleSendMessage} />
    </KeyboardAvoidingView>
  );
}

export default ChatDetailScreen;
