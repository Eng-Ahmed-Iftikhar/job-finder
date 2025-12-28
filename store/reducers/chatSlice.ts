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
  chatBlock: ChatBlock[];
}

const initialState: ChatState = {
  messages: [],
  chatBlock: [],
  chats: [],
  chatUsers: [],
  chatGroups: [],
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
      const previousMessage = state.messages.find(
        (msg) => msg.id === action.payload.id
      );
      if (previousMessage) {
        state.messages = state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.message }
            : msg
        );
      } else {
        state.messages.push(action.payload.message);
      }
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      state.messages.push(message);
    },
    upsertMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const index = state.messages.findIndex((msg) => msg.id === message.id);
      if (index !== -1) {
        state.messages[index] = message;
      } else {
        state.messages.push(message);
      }
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
      if (state.chats.find((chat) => chat.id === action.payload.id)) {
        return;
      }
      state.chats.unshift(action.payload);
      state.chatUsers = _.uniqBy(
        [...state.chatUsers, ...action.payload.users],
        "id"
      );
      state.chatGroups = _.uniqBy(
        [
          ...state.chatGroups,
          ...(action.payload.group ? [action.payload.group] : []),
        ],
        "id"
      );
    },
    removeChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
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
        state.chatUsers = _.uniqBy(
          [...state.chatUsers, ...newChat.users],
          "id"
        );
        state.chatGroups = _.uniqBy(
          [...state.chatGroups, ...(newChat.group ? [newChat.group] : [])],
          "id"
        );
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
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getAllUnreadMessage.matchFulfilled,
      (state, action) => {
        const unreadMessages = action.payload;
        state.messages = _.uniqBy([...state.messages, ...unreadMessages], "id");
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChat.matchFulfilled,
      (state, action) => {
        const chat = action.payload;
        const exists = state.chats.some((c) => c.id === chat.id);
        if (!exists) {
          state.chats.unshift(chat);
        }
        state.chatUsers = _.uniqBy([...state.chatUsers, ...chat.users], "id");
        state.chatGroups = _.uniqBy(
          [...state.chatGroups, ...(chat.group ? [chat.group] : [])],
          "id"
        );
      }
    );

    // Update chatGroups on editChatGroup
    builder.addMatcher(
      chatApi.endpoints.editChatGroup.matchFulfilled,
      (state, action) => {
        const updatedGroup = action.payload;
        console.log({ updatedGroup });

        const idx = state.chatGroups.findIndex((g) => g.id === updatedGroup.id);
        if (idx !== -1) {
          state.chatGroups[idx] = { ...state.chatGroups[idx], ...updatedGroup };
        } else {
          state.chatGroups.push(updatedGroup as ChatGroup);
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
  upsertMessage,
} = chatSlice.actions;

export const selectChats = (state: RootState) => state.chats.chats;
export const selectMessages = (state: RootState) => state.chats.messages;
export const selectChatUsers = (state: RootState) => state.chats.chatUsers;
export const selectChatGroups = (state: RootState) => state.chats.chatGroups;
export const selectChatBlock = (state: RootState) => state.chats.chatBlock;

export default chatSlice.reducer;
