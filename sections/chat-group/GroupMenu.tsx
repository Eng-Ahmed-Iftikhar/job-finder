import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import { selectUser } from "@/store/reducers/userSlice";
import { CHAT_USER_ROLE } from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Modal, Pressable, View, TouchableOpacity, Text } from "react-native";

interface GroupMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
  onDelete?: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onBlock,
  onDelete,
}) => {
  const user = useAppSelector(selectUser);
  const params = useLocalSearchParams();
  const chatId = typeof params.id === "string" ? params.id : "";

  const { chatUsers } = useChat(chatId);
  const currentUserInChat = chatUsers.find(
    (userInChat) => userInChat.user.id === user?.id
  );
  const isAdmin = currentUserInChat?.role === CHAT_USER_ROLE.ADMIN;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            top: 90,
            right: 50,
            backgroundColor: "#fff",
            borderRadius: 8,
            elevation: 4,
            minWidth: 180,
          }}
          className="p-2"
        >
          {isAdmin && (
            <TouchableOpacity
              className="py-3 px-4"
              onPress={() => {
                onEdit && onEdit();
                onClose();
              }}
            >
              <Text className="text-gray-900">Edit Group</Text>
            </TouchableOpacity>
          )}
          {!isAdmin && (
            <TouchableOpacity
              className="py-3 px-4"
              onPress={() => {
                onBlock && onBlock();
                onClose();
              }}
            >
              <Text className="text-gray-900">Block Group</Text>
            </TouchableOpacity>
          )}

          {isAdmin && (
            <TouchableOpacity
              className="py-3 px-4"
              onPress={() => {
                onDelete && onDelete();
                onClose();
              }}
            >
              <Text className="text-red-600">Delete Group</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default GroupMenu;
