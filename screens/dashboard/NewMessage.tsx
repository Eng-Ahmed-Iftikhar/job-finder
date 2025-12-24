import { useAppSelector } from "@/hooks/useAppSelector";
import ContactSuggestItem from "@/sections/new-message/ContactSuggestItem";
import NewMessageHeader from "@/sections/new-message/NewMessageHeader";
import SelectUsers from "@/sections/new-message/SelectUsers";
import { selectUserConnections } from "@/store/reducers/userSlice";
import { ContactItem } from "@/types/api/message";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";

function NewMessageScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const connections = useAppSelector(selectUserConnections);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <NewMessageHeader />
      <SelectUsers
        onCreateConversation={handleCreateConversation}
        onSearchChange={setSearch}
        selectedUsers={selectedUsers}
        onRemoveUser={handleRemoveUser}
      />

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
    </KeyboardAvoidingView>
  );
}
export default NewMessageScreen;
