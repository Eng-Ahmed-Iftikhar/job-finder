import {
  useCreateChatMessageMutation,
  useUpdateMessageStatusMutation,
} from "@/api/services/chatApi";
import { useUploadFileMutation } from "@/api/services/fileApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import { updateMessage } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessage,
  ChatMessageFile,
} from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import Message from "./Message";

const MessageBubble = ({
  message,
}: {
  message: ChatMessage & { file?: ChatMessageFile | null };
}) => {
  const user = useAppSelector(selectUser);
  const { chatUsers = [], chatMembers = [] } = useChat(message?.chatId || "");
  const dispatch = useAppDispatch();
  const [createMessage] = useCreateChatMessageMutation();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();

  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();

  const chatUser = chatUsers.find((user) => user.userId === message.senderId);
  const isOwn = message.senderId === user?.id;

  const pictureUrl = chatUser?.user.profile.pictureUrl || "";
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleCreateMessage = useCallback(async () => {
    if (message.status !== CHAT_MESSAGE_STATUS.PENDING) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    let url = "";
    if (
      message.messageType === CHAT_MESSAGE_TYPE.IMAGE ||
      message.messageType === CHAT_MESSAGE_TYPE.FILE
    ) {
      const formData = new FormData();
      formData.append("file", message.file as any);
      formData.append("fileType", "image");
      formData.append("folderPath", "profile-images");
      formData.append("customFilename", `profile-${Date.now()}`);
      const fileUploadResponse = await uploadFile(formData).unwrap();
      url = fileUploadResponse.url;
    }

    const result = await createMessage({
      id: message.chatId,
      body: {
        senderId: message.senderId,
        ...(url ? { fileUrl: url } : {}),
        ...(message.text ? { text: message.text } : {}),
        messageType: message.messageType,
      },
      signal: abortControllerRef.current.signal,
    }).unwrap();
    dispatch(updateMessage({ id: message.id, message: result }));

    return result;
  }, [message, createMessage]);

  const receivedUsers =
    message.userStatuses?.filter(
      (status) => status.receivedAt && status.userId !== message.senderId
    ) || [];

  const seenUsers =
    message.userStatuses?.filter(
      (status) => status.seenAt && status.userId !== message.senderId
    ) || [];

  const isReceivedByAllOthers = chatUsers.length === receivedUsers.length;
  const isSeenByAllOthers = chatUsers.length === seenUsers.length;

  const handleMessageSeenStatusUpdate = useCallback(async () => {
    if (isOwn) return;
    const userStatus = message.userStatuses?.find(
      (status) => status.userId === user?.id && status.receivedAt
    );

    if (!userStatus?.receivedAt) return;

    if (userStatus.seenAt) return;

    try {
      const now = new Date();
      await updateMessageStatus({
        statusId: userStatus.id,
        seenAt: now,
      }).unwrap();
    } catch (error) {
      console.log(
        `Marking message ${message.id} in chat ${message.chatId} as seen`
      );
    }
  }, [message, isOwn, user, updateMessageStatus]);

  useEffect(() => {
    handleCreateMessage();
  }, [handleCreateMessage]);

  useEffect(() => {
    handleMessageSeenStatusUpdate();
  }, [handleMessageSeenStatusUpdate]);

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
        <Message message={message} loading={isUploadingFile} />
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
                <>
                  {isReceivedByAllOthers ? (
                    <Ionicons
                      name={"checkmark-done"}
                      size={14}
                      color={isSeenByAllOthers ? "#1eadff" : "gray"}
                    />
                  ) : (
                    <Ionicons name="checkmark" size={14} color="#6B7280" />
                  )}
                </>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
