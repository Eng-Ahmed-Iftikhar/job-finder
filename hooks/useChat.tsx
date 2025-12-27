import {
  selectChatGroups,
  selectChats,
  selectChatUsers,
  selectMessages,
} from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { useMemo } from "react";
import { useAppSelector } from "./useAppSelector";

const useChat = (chatId: string) => {
  const user = useAppSelector(selectUser) || null;
  const users = useAppSelector(selectChatUsers) || [];
  const groups = useAppSelector(selectChatGroups) || [];
  const chats = useAppSelector(selectChats) || [];
  const messages = useAppSelector(selectMessages) || [];

  const chatGroup = groups?.find((group) => group.chatId === chatId);
  const chat = chats?.find((chat) => chat.id === chatId);
  const chatUsers = users.filter((chatsUser) => chatsUser.chatId === chatId);
  const chatMembers = chatUsers.filter(
    (chatsUser) => chatsUser.userId !== user?.id
  );
  const chatMessages = messages.filter((message) => message.chatId === chatId);

  const chatName = useMemo(() => {
    let name = "N/A";
    if (chatGroup) {
      name = chatGroup.name;
    } else {
      const chatUsersnames = chatMembers.map(
        (chatUser) =>
          chatUser.user.profile.firstName + " " + chatUser.user.profile.lastName
      );
      name = chatUsersnames.join(", ");
    }
    return name;
  }, [chatGroup, chatUsers]);

  const chatIconUrl = useMemo(() => {
    let icon = "";
    if (chatGroup?.icon) {
      icon = chatGroup.icon;
    } else {
      const chatUsersPics = chatMembers.map(
        (chatUser) => chatUser.user.profile.pictureUrl || ""
      );
      icon = chatUsersPics?.[0] || "";
    }
    return icon;
  }, [chatGroup, chatUsers]);

  const unreedMessagesCount = useMemo(() => {
    if (!chat) return 0;
    const unseenMessages = messages.filter(
      (message) =>
        message.chatId === chat.id &&
        message.senderId !== user?.id &&
        !message.userStatuses?.some((status) => status.seenAt)
    );
    return unseenMessages.length;
  }, [messages, chat, user]);
  return {
    chatGroup,
    chatUsers,
    chatMembers,
    chatName,
    chatIconUrl,
    chat,
    unreedMessagesCount,
    chatMessages,
  };
};

export default useChat;
