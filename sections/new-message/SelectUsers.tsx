import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import SelectedUser from "./SelectedUser";
type SelectedUserType = {
  id: string;
  firstName: string;
  lastName: string;
};

type SelectUsersProps = {
  onSearchChange: (text: string) => void;
  selectedUsers?: Array<SelectedUserType>;
  onRemoveUser: (userId: string) => void;
  onCreateConversation: () => void;
};

function SelectUsers({
  onSearchChange,
  selectedUsers = [],
  onRemoveUser,
  onCreateConversation,
}: SelectUsersProps) {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    onSearchChange(text);
  };

  return (
    <View className="px-4 py-3 flex-row w-full items-center justify-between">
      <View
        style={{ flexWrap: "wrap", width: "90%" }}
        className=" gap-1 flex-row p-2 bg-white rounded-xl text-base text-gray-900 border-2 border-azure-radiance-500"
      >
        {selectedUsers.map((user) => {
          return (
            <SelectedUser
              key={user.id}
              name={`${user.firstName} ${user.lastName}`}
              onRemove={() => onRemoveUser(user.id as string)}
            />
          );
        })}

        <View className=" h-10 ">
          <TextInput
            placeholder="Type name of the user or business"
            placeholderTextColor="#9CA3AF"
            value={searchInput}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => onCreateConversation()}>
        <Ionicons name="send" size={20} color="#1eadff" />
      </TouchableOpacity>
    </View>
  );
}

export default SelectUsers;
