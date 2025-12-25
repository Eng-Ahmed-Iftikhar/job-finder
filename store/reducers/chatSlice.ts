import { GetChatsResponse, GetMessagesResponse } from "@/types/api/chat";
import {
  Chat,
  ChatBlock,
  ChatGroup,
  ChatMessage,
  ChatMessagesByDate,
  ChatUser,
  MessageReaction,
  MessageReply,
  MessageUserStatus,
} from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

// Enable Map/Set support for Immer (required for Map usage in state)
enableMapSet();
import { RootState } from ".";
import { chatApi } from "@/api/services/chatApi";
import _ from "lodash";

// Define the initial state for the UI slice
interface ChatState {
  messages: ChatMessage[];
  chats: Chat[];
  chatUsers: ChatUser[];
  chatGroups: ChatGroup[];
  messageReactions: MessageReaction[];
  messageReply: MessageReply[];
  messageUserStatus: MessageUserStatus[];
  chatBlock: ChatBlock[];
  chatMessagesMap: Map<string, ChatMessagesByDate[]>;
}

const initialState: ChatState = {
  messages: [],
  chatBlock: [],
  chats: [],
  chatUsers: [],
  chatGroups: [],
  messageReactions: [],
  messageReply: [],
  messageUserStatus: [],
  chatMessagesMap: new Map<string, ChatMessagesByDate[]>(),
};

const chatSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<GetMessagesResponse>) {
      const response = action.payload;
      const page = response.page ?? 1;

      if (page === 1) {
        state.messages = response.data;
        return;
      }
      state.messages = [...state.messages, ...response.data];
    },
    updateMessage(
      state,
      action: PayloadAction<{ id: string; message: ChatMessage }>
    ) {
      const updatedMessage = action.payload;
      const index = state.messages.findIndex(
        (msg) => msg.id === updatedMessage.id
      );
      if (index !== -1) {
        state.messages[index] = {
          ...state.messages[index],
          ...updatedMessage.message,
        };

        // Update chatMessagesMap for the relevant chatId
        const chatId = updatedMessage.message.chatId;
        const messages = state.messages.filter((msg) => msg.chatId === chatId);
        const messagesByDate: ChatMessagesByDate[] = [];
        messages.forEach((msg) => {
          const dateKey =
            new Date(msg.createdAt).getDay() +
            "-" +
            new Date(msg.createdAt).getMonth() +
            "-" +
            new Date(msg.createdAt).getFullYear();

          let dateGroup = messagesByDate.find((group) => {
            const groupDateKey =
              new Date(group.date).getDay() +
              "-" +
              new Date(group.date).getMonth() +
              "-" +
              new Date(group.date).getFullYear();
            return groupDateKey === dateKey ? group : null;
          });

          if (!dateGroup) {
            dateGroup = { date: new Date(msg.createdAt), messages: [msg] };
            messagesByDate.push(dateGroup);
          } else {
            const previousMessages =
              messagesByDate[messagesByDate.indexOf(dateGroup)].messages;
            const alreadyHaveMessage = previousMessages.find(
              (m) => m.id === msg.id
            );
            if (!alreadyHaveMessage) {
              messagesByDate[messagesByDate.indexOf(dateGroup)].messages.push(
                msg
              );
            } else {
              // If the message exists, update it in place
              const msgIdx = previousMessages.findIndex((m) => m.id === msg.id);
              if (msgIdx !== -1) {
                previousMessages[msgIdx] = msg;
              }
            }
          }
        });
        state.chatMessagesMap.set(chatId, messagesByDate);
      }
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      state.messages.push(message);

      // Update chatMessagesMap for the relevant chatId
      const chatId = message.chatId;
      const messages = state.messages.filter((msg) => msg.chatId === chatId);
      const messagesByDate: ChatMessagesByDate[] = [];
      messages.forEach((msg) => {
        const dateKey =
          new Date(msg.createdAt).getDay() +
          "-" +
          new Date(msg.createdAt).getMonth() +
          "-" +
          new Date(msg.createdAt).getFullYear();

        let dateGroup = messagesByDate.find((group) => {
          const groupDateKey =
            new Date(group.date).getDay() +
            "-" +
            new Date(group.date).getMonth() +
            "-" +
            new Date(group.date).getFullYear();
          return groupDateKey === dateKey ? group : null;
        });

        if (!dateGroup) {
          dateGroup = { date: new Date(msg.createdAt), messages: [msg] };
          messagesByDate.push(dateGroup);
        } else {
          const previousMessages =
            messagesByDate[messagesByDate.indexOf(dateGroup)].messages;
          const alreadyHaveMessage = previousMessages.find(
            (m) => m.id === msg.id
          );
          if (!alreadyHaveMessage) {
            messagesByDate[messagesByDate.indexOf(dateGroup)].messages.push(
              msg
            );
          }
        }
      });
      state.chatMessagesMap.set(chatId, messagesByDate);
    },
    removeMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
    setChats(state, action: PayloadAction<GetChatsResponse>) {
      const response = action.payload;
      const page = response.page ?? 1;

      if (page === 1) {
        state.chats = response.data.chats;
        state.chatUsers = response.data.users;
        state.chatGroups = response.data.groups;
        state.messages = response.data.messages;
        return;
      }
      state.chats = [...state.chats, ...response.data.chats];
      state.chatUsers = [...state.chatUsers, ...response.data.users];
      state.chatGroups = [...state.chatGroups, ...response.data.groups];
      state.messages = [...state.messages, ...response.data.messages];
    },
    updateChat(state, action: PayloadAction<Chat>) {
      const updatedChat = action.payload;
      const index = state.chats.findIndex((chat) => chat.id === updatedChat.id);
      if (index !== -1) {
        state.chats[index] = {
          ...state.chats[index],
          ...updatedChat,
        };
      }
    },
    addChat(state, action: PayloadAction<Chat>) {
      state.chats.push(action.payload);
    },
    removeChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
    updateChatMessagesMap(
      state,
      action: PayloadAction<{
        chatId: string;
        messagesByDate: ChatMessagesByDate[];
      }>
    ) {
      const { chatId, messagesByDate } = action.payload;
      state.chatMessagesMap.set(chatId, messagesByDate);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatApi.endpoints.createChat.matchFulfilled,
      (state, action) => {
        const newChat = action.payload;

        const exists = state.chats.some((chat) => chat.id === newChat.id);
        if (!exists) {
          state.chats.unshift(newChat);
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChats.matchFulfilled,
      (state, action) => {
        const response = action.payload;
        const page = response.page ?? 1;
        if (page === 1) {
          state.chats = response.data.chats;
          state.chatUsers = response.data.users;
          state.chatGroups = response.data.groups;
          state.messages = response.data.messages;
          return;
        }
        state.chats = _.uniqBy([...state.chats, ...response.data.chats], "id");
        state.chatUsers = _.uniqBy(
          [...state.chatUsers, ...response.data.users],
          "id"
        );
        state.chatGroups = _.uniqBy(
          [...state.chatGroups, ...response.data.groups],
          "id"
        );
        state.messages = _.uniqBy(
          [...state.messages, ...response.data.messages],
          "id"
        );
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChatMessages.matchFulfilled,
      (state, action) => {
        const response = action.payload;
        const page = response.page ?? 1;
        if (page === 1) {
          state.messages = response.data;
        } else {
          state.messages = _.uniqBy(
            [...state.messages, ...response.data],
            "id"
          );
        }

        // Group messages by date and update chatMessagesMap
        if (response.data && response.data.length > 0) {
          const chatId = response.data[0].chatId;
          const messages = state.messages.filter(
            (msg) => msg.chatId === chatId
          );
          const messagesByDate: ChatMessagesByDate[] = [];
          messages.forEach((msg) => {
            const dateKey =
              new Date(msg.createdAt).getDay() +
              "-" +
              new Date(msg.createdAt).getMonth() +
              "-" +
              new Date(msg.createdAt).getFullYear();

            let dateGroup = messagesByDate.find((group) => {
              const groupDateKey =
                new Date(group.date).getDay() +
                "-" +
                new Date(group.date).getMonth() +
                "-" +
                new Date(group.date).getFullYear();
              return groupDateKey === dateKey ? group : null;
            });

            if (!dateGroup) {
              dateGroup = { date: new Date(msg.createdAt), messages: [msg] };
              messagesByDate.push(dateGroup);
            } else {
              const previousMessages =
                messagesByDate[messagesByDate.indexOf(dateGroup)].messages;
              const alreadyHaveMessage = previousMessages.find(
                (m) => m.id === msg.id
              );
              if (!alreadyHaveMessage) {
                messagesByDate[messagesByDate.indexOf(dateGroup)].messages.push(
                  msg
                );
              }
            }
          });
          state.chatMessagesMap.set(chatId, messagesByDate);
        }
      }
    );
  },
});

export const {
  setChats,
  updateChat,
  addChat,
  addMessage,
  updateMessage,
  removeChat,
  removeMessage,
  setMessages,
  updateChatMessagesMap,
} = chatSlice.actions;

export const selectChats = (state: RootState) => state.chats.chats;
export const selectMessages = (state: RootState) => state.chats.messages;
export const selectChatUsers = (state: RootState) => state.chats.chatUsers;
export const selectChatGroups = (state: RootState) => state.chats.chatGroups;
export const selectMessageReactions = (state: RootState) =>
  state.chats.messageReactions;
export const selectMessageReply = (state: RootState) =>
  state.chats.messageReply;
export const selectMessageUserStatus = (state: RootState) =>
  state.chats.messageUserStatus;
export const selectChatBlock = (state: RootState) => state.chats.chatBlock;
export const selectChatMessagesMap = (state: RootState) =>
  state.chats.chatMessagesMap;

export default chatSlice.reducer;
