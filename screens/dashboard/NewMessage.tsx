import { useAppSelector } from "@/hooks/useAppSelector";
import SendActions from "@/sections/new-message/SendActions";
import ContactSuggestItem from "@/sections/new-message/ContactSuggestItem";
import NewMessageHeader from "@/sections/new-message/NewMessageHeader";
import SelectUsers from "@/sections/new-message/SelectUsers";
import { selectUser, selectUserConnections } from "@/store/reducers/userSlice";
import { ContactItem } from "@/types/api/message";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { useCreateChatMutation } from "@/api/services/chatApi";
import { CreateChatRequest } from "@/types/api/chat";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
} from "@/types/chat";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showErrorNotification } from "@/store/reducers/notificationSlice";
import { addMessage } from "@/store/reducers/chatSlice";

function NewMessageScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  const handleCreateConversation = () => {
    // Handle conversation creation with selectedUsers
    router.push({
      pathname: "/messages/chat",
      params: { userIds: selectedUsers.map((user) => user.id).join(",") },
    });
  };

  const handleSendMessage = async (message: string) => {
    try {
      const createChatPayload: CreateChatRequest = {
        userIds: selectedUsers.map((user) => user.id),
        type: selectedUsers.length > 1 ? CHAT_TYPE.GROUP : CHAT_TYPE.PRIVATE,
        ...(selectedUsers.length > 1 && { groupName: "untitled" }),
      };

      const response = await createChat(createChatPayload).unwrap();
      dispatch(
        addMessage({
          id: "temp-id",
          chatId: response.id,
          senderId: user?.id as string,
          messageType: CHAT_MESSAGE_TYPE.TEXT,
          text: message,
          status: CHAT_MESSAGE_STATUS.PENDING,
          createdAt: new Date(),
        })
      );
      const chatId = response.id;
      router.push({ pathname: "/messages/chat", params: { id: chatId } });
    } catch (error) {
      dispatch(
        showErrorNotification("Failed to create chat. Please try again.")
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 "
    >
      <NewMessageHeader />
      <View className="p-4">
        <SelectUsers
          onCreateConversation={handleCreateConversation}
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
      <SendActions loading={creatingChat} onSendMessage={handleSendMessage} />
    </KeyboardAvoidingView>
  );
}
export default NewMessageScreen;
