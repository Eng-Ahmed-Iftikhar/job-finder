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
import moment from "moment";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import Message from "./Message";
import { usePathname } from "expo-router";

type MessageBubbleProps = {
  messageId: string;
  chatId: string;
};

const MessageBubble = ({ messageId, chatId }: MessageBubbleProps) => {
  // All hooks must be called unconditionally, before any return
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const { chat, chatUsers = [] } = useChat(chatId);
  const message = chat?.messagesWithDates
    .flatMap((group) => group.data)
    .find((msg) => msg.id === messageId) as ChatMessage | undefined;

  const [createMessage, { isLoading: isCreating }] =
    useCreateChatMessageMutation();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();
  const abortControllerRef = useRef<AbortController | null>(null);
  const statusControllerRef = useRef<AbortController | null>(null);
  const hasCreatedRef = useRef(false);
  const hasStatusRef = useRef(false);
  const dispatch = useAppDispatch();

  const chatUser = chatUsers.find(
    (user) => user.userId === (message?.senderId ?? message?.senderId)
  );
  const isOwn = (message?.senderId ?? message?.senderId) === user?.id;
  const pictureUrl = chatUser?.user.profile.pictureUrl || "";

  // Prevent double execution (e.g., React Strict Mode)
  const handleCreateMessage = useCallback(async () => {
    if (hasCreatedRef.current) return;
    if (!message) return;
    if (message.status !== CHAT_MESSAGE_STATUS.PENDING) return;
    if (!isOwn) return;
    if (isCreating) return;
    hasCreatedRef.current = true;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    console.log(user?.id, "sdfdasf", message.id);

    let url = "";
    if (
      message.messageType === CHAT_MESSAGE_TYPE.IMAGE ||
      message.messageType === CHAT_MESSAGE_TYPE.FILE
    ) {
      const formData = new FormData();
      formData.append("file", (message as any)?.file);
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
    console.log("after");

    dispatch(updateMessage({ id: message.id, message: result }));

    return result;
  }, [
    message,
    createMessage,
    uploadFile,
    abortControllerRef,
    isOwn,
    isCreating,
  ]);

  // Seen/received logic
  const receivedUsers =
    message?.userStatuses?.filter((status) => status.receivedAt) || [];
  const seenUsers =
    message?.userStatuses?.filter((status) => status.seenAt) || [];
  const chatUserWithoutSender = chatUsers.filter(
    (chatUser) => chatUser.userId !== (message?.senderId ?? message?.senderId)
  );
  const isSeenByAllOthers = chatUserWithoutSender.length === seenUsers.length;
  const userStatus = message?.userStatuses?.find(
    (status) =>
      status.userId === user?.id && status.receivedAt && !status.seenAt
  );

  const handleMessageSeenStatusUpdate = useCallback(async () => {
    if (!userStatus) return;
    if (hasStatusRef.current) return;
    if (isOwn) return;
    hasStatusRef.current = true;

    statusControllerRef.current?.abort();
    statusControllerRef.current = new AbortController();
    try {
      const now = new Date();
      await updateMessageStatus({
        statusId: userStatus.id,
        seenAt: now,
        signal: statusControllerRef.current?.signal,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update message seen status", error);
    }
  }, [userStatus, updateMessageStatus, isOwn]);

  useEffect(() => {
    hasCreatedRef.current = false;
    if (pathname !== `/messages/chat`) return;
    handleCreateMessage();
  }, [handleCreateMessage, message?.id, pathname]);

  useEffect(() => {
    if (pathname !== `/messages/chat`) return;

    hasStatusRef.current = false;
    handleMessageSeenStatusUpdate();
  }, [handleMessageSeenStatusUpdate, userStatus?.id, pathname]);
  if (!message) {
    return null;
  }
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
            {moment(message?.createdAt).format("hh:mm A")}
          </Text>
          {/* Seen double tick for own messages */}
          {isOwn && (
            <View>
              {message.status === CHAT_MESSAGE_STATUS.PENDING ? (
                <Ionicons name="time" size={14} color="#6B7280" />
              ) : message.status === CHAT_MESSAGE_STATUS.SENT ? (
                <>
                  {receivedUsers.length > 0 ? (
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

export default memo(MessageBubble);
