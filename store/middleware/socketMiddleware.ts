// src/store/socketMiddleware.js
import { Chat, ChatMessage } from "@/types/chat";
import { CHAT_SOCKET_EVENT, CHAT_SOCKET_ROOM } from "@/types/socket";
import { initSocket } from "@/utils/socket";
import { Middleware } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";

import { Socket } from "socket.io-client";
import { addChat, upsertMessage } from "../reducers/chatSlice";
import { socketConnected, socketDisconnected } from "../reducers/socketSlice";
import { router } from "expo-router";

let socket: Socket | null = null;

// Map notificationId to chatId
let newMessageNotifications: {
  notificationId: string;
  chatMessage: ChatMessage;
}[] = [];

export const socketMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (action.type === "socket/connect") {
      const state = storeAPI.getState();
      const accessToken = state.auth?.access_token;
      socket = initSocket("/chats", accessToken);
      socket.connect();

      socket.on("connect", () => {
        storeAPI.dispatch(socketConnected());
        socket?.emit(CHAT_SOCKET_ROOM.USERS);
      });

      socket.on("disconnect", () => {
        storeAPI.dispatch(socketDisconnected());
      });

      socket.on(CHAT_SOCKET_EVENT.NEW_CHAT, (chat: Chat) => {
        storeAPI.dispatch(addChat(chat));
      });

      socket.on(CHAT_SOCKET_EVENT.NEW_MESSAGE, async (message: ChatMessage) => {
        const state = storeAPI.getState();
        const userId = state.user.user?.id;
        // Only trigger one notification per chatId until dismissed
        const alreadyNotified = newMessageNotifications.find(
          (n) => n.chatMessage.id === message.id
        );

        if (!alreadyNotified) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "New Message Received",
              body: message.text || "You have received a new message.",
              sound: "default",
            },
            trigger: null,
          });
          newMessageNotifications.push({
            notificationId,
            chatMessage: message,
          });
        }

        if (userId !== message.senderId) {
          socket?.emit(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, {
            id: message.id,
            userId,
          });
        }
        storeAPI.dispatch(upsertMessage(message));
      });

      socket.on(CHAT_SOCKET_EVENT.MESSAGE_RECEIVED, (message: ChatMessage) => {
        storeAPI.dispatch(upsertMessage(message));
      });
      socket.on(CHAT_SOCKET_EVENT.MESSAGE_SEEN, (message) => {
        storeAPI.dispatch(upsertMessage(message));
      });
    }

    if (action.type === "socket/disconnect") {
      socket?.disconnect();
    }

    return next(action);
  };

Notifications.addNotificationResponseReceivedListener((response) => {
  const notificationId = response.notification.request.identifier;
  const chatNotification = newMessageNotifications.find(
    (n) => n.notificationId === notificationId
  );
  if (chatNotification) {
    // redirect to chat screen with chatId
    router.push({
      pathname: "/messages/chat",
      params: { id: chatNotification.chatMessage.chatId },
    });
    Notifications.dismissNotificationAsync(notificationId);
    // Optionally, remove the notificationId from the map
    newMessageNotifications = newMessageNotifications.filter(
      (n) => n.notificationId !== notificationId
    );
  }
});
