import { useAppSelector } from "@/hooks/useAppSelector";
import SendActions from "@/sections/new-message/SendActions";
import ContactSuggestItem from "@/sections/new-message/ContactSuggestItem";
import NewMessageHeader from "@/sections/new-message/NewMessageHeader";
import SelectUsers from "@/sections/new-message/SelectUsers";
import { selectUser, selectUserConnections } from "@/store/reducers/userSlice";
import { ContactItem } from "@/types/api/message";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { useCreateChatMutation } from "@/api/services/chatApi";
import { CreateChatRequest } from "@/types/api/chat";
import {
  Chat,
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
} from "@/types/chat";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showErrorNotification } from "@/store/reducers/notificationSlice";
import { addMessage, selectChats } from "@/store/reducers/chatSlice";
import { SafeAreaView } from "react-native";

function NewMessageScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const chats = useAppSelector(selectChats);

  const connections = useAppSelector(selectUserConnections);
  const user = useAppSelector(selectUser);
  const [createChat, { isLoading: creatingChat }] = useCreateChatMutation();
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; firstName: string; lastName: string; pictureUrl: string }[]
  >([]);

  const filteredContacts = useMemo(
    () =>
      connections
        .filter(
          (item) =>
            item.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            item.user.lastName.toLowerCase().includes(search.toLowerCase())
        )
        .filter(
          (item) => !selectedUsers.some((user) => user.id === item.user.id)
        ),
    [search, selectedUsers, connections]
  );

  const onSelectContact = (item: ContactItem) => {
    const isAlreadySelected = selectedUsers.some(
      (user) => user.id === item.user.id
    );
    if (!isAlreadySelected) {
      setSelectedUsers((prevUsers) => [
        ...prevUsers,
        {
          id: item.user.id,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          pictureUrl: item.user.pictureUrl || "",
        },
      ]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
  };

  const handleCreateChat = useCallback(async () => {
    const createChatPayload: CreateChatRequest = {
      userIds: selectedUsers.map((user) => user.id),
      type: selectedUsers.length > 1 ? CHAT_TYPE.GROUP : CHAT_TYPE.PRIVATE,
      ...(selectedUsers.length > 1 && { groupName: "untitled" }),
    };
    const response = await createChat(createChatPayload).unwrap();
    return response;
  }, [selectedUsers, createChat]);

  const handleExistingChat = useCallback(async () => {
    let newChat: Chat | null = null;
    if (selectedUsers.length === 1) {
      const chat = chats.find(
        (c) =>
          c.users.find((chatUser) => chatUser.userId === selectedUsers[0].id) &&
          c.type === CHAT_TYPE.PRIVATE
      );

      newChat = chat as Chat;
    }
    return newChat;
  }, [selectedUsers, chats]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          text: message,
          messageType: CHAT_MESSAGE_TYPE.TEXT,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          chatId: "",
          senderId: user?.id || "",
        };
        const chat = await handleExistingChat();
        if (chat) {
          Object.assign(newMessage, { chatId: chat.id });
          router.push({
            pathname: "/messages/chat",
            params: { id: chat.id },
          });
          dispatch(addMessage(newMessage));
          return;
        }

        const response = await handleCreateChat();
        const chatId = response.id;
        Object.assign(newMessage, { chatId });
        dispatch(addMessage(newMessage));
        router.push({ pathname: "/messages/chat", params: { id: chatId } });
      } catch (error) {
        console.log(error);

        dispatch(
          showErrorNotification("Failed to create chat. Please try again.")
        );
      }
    },
    [selectedUsers, user, handleCreateChat, handleExistingChat]
  );

  const handleSelectImage = useCallback(
    async (image: { uri: string; type: string; name: string }) => {
      try {
        const newChat = await handleExistingChat();
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          file: image,
          messageType: CHAT_MESSAGE_TYPE.IMAGE,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          chatId: newChat?.id || "",
          senderId: user?.id || "",
        };

        if (newChat) {
          router.push({
            pathname: "/messages/chat",
            params: { id: newChat.id },
          });
          dispatch(addMessage(newMessage));

          return;
        }

        const response = await handleCreateChat();
        Object.assign(newMessage, { chatId: response.id });

        dispatch(addMessage(newMessage));
      } catch (error) {
        dispatch(
          showErrorNotification("Failed to create chat. Please try again.")
        );
      }
    },
    [selectedUsers, user, handleCreateChat, handleExistingChat]
  );

  const handleSelectFile = useCallback(
    async (file: { uri: string; type: string; name: string }) => {
      try {
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          file,
          messageType: CHAT_MESSAGE_TYPE.FILE,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          senderId: user?.id || "",
          chatId: "",
        };
        const newChat = await handleExistingChat();

        if (newChat) {
          Object.assign(newMessage, { chatId: newChat.id });
          router.push({
            pathname: "/messages/chat",
            params: { id: newChat.id },
          });
          dispatch(addMessage(newMessage));
          return;
        }

        const response = await handleCreateChat();
        Object.assign(newMessage, { chatId: response.id });

        dispatch(addMessage(newMessage));
      } catch (error) {
        dispatch(
          showErrorNotification("Failed to create chat. Please try again.")
        );
      }
    },
    [selectedUsers, user, handleCreateChat, handleExistingChat]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <NewMessageHeader />
        <View className="p-4">
          <SelectUsers
            onSearchChange={setSearch}
            selectedUsers={selectedUsers}
            onRemoveUser={handleRemoveUser}
          />
        </View>

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
        <SendActions
          loading={creatingChat}
          onSelectImage={handleSelectImage}
          onAttachFile={handleSelectFile}
          onSendMessage={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export default NewMessageScreen;
