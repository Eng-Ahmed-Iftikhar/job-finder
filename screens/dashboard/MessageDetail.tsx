import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import MessageDetailBody from "@/sections/message-detail/MessageDetailBody";
import MessageDetailHeader from "@/sections/message-detail/MessageDetailHeader";
import SendActions from "@/sections/new-message/SendActions";
import { addMessage } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { CreateChatMessageRequest } from "@/types/api/chat";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessageFile,
} from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";

type MessagePaypoad = CreateChatMessageRequest & {
  id: string;
  createdAt: Date;
  status: CHAT_MESSAGE_STATUS;
  chatId: string;
  file?: ChatMessageFile;
};

function ChatDetailScreen() {
  const param = useLocalSearchParams();
  const user = useAppSelector(selectUser);
  const id = typeof param.id === "string" ? param.id : "";
  const dispatch = useAppDispatch();

  const handleSendMessage = (text: string) => {
    const newMessage: MessagePaypoad = {
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

  const handleSelectImage = async (image: {
    uri: string;
    type: string;
    name: string;
  }) => {
    const newMessage: MessagePaypoad = {
      id: Math.random().toString(36).substring(7),
      file: image,
      messageType: CHAT_MESSAGE_TYPE.IMAGE,
      createdAt: new Date(),
      status: CHAT_MESSAGE_STATUS.PENDING,
      chatId: id,
      senderId: user?.id || "",
    };

    dispatch(addMessage(newMessage));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <MessageDetailHeader />
        <MessageDetailBody />
        <SendActions
          onSendMessage={handleSendMessage}
          onSelectImage={handleSelectImage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatDetailScreen;
