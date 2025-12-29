import { chatApi } from "@/api/services/chatApi";
import { GetChatsResponse, GetMessagesResponse } from "@/types/api/chat";
import { Chat, ChatGroup, ChatMessage } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import _, { update } from "lodash";
import { RootState } from ".";
import moment from "moment";

// Enable Map/Set support for Immer (required for Map usage in state)
enableMapSet();

// Define the initial state for the UI slice
interface ChatState {
  chats: Chat[];
}

const initialState: ChatState = {
  chats: [],
};

const chatSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === message.chatId
      );
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messageDate = moment(message.createdAt);
        const messagesWithDates = chat.messagesWithDates || [];
        let dateGroup = messagesWithDates.find((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (!dateGroup) {
          dateGroup = { date: messageDate.toDate(), data: [] };
          messagesWithDates.push(dateGroup);
        }
        dateGroup.data.push(message);
        // Sort messages in the date group
        dateGroup.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sort messagesWithDates by date
        messagesWithDates.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    upsertMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === message.chatId
      );
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messagesWithDates = chat.messagesWithDates || [];
        const messageDate = moment(message.createdAt).toDate();
        let dateGroupIndex = messagesWithDates.findIndex((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (dateGroupIndex === -1) {
          const dateGroup = { date: messageDate, data: [] };
          messagesWithDates.push(dateGroup);
        }

        const messageIndex = messagesWithDates[dateGroupIndex].data.findIndex(
          (m) => m.id === message.id
        );
        if (messageIndex !== -1) {
          messagesWithDates[dateGroupIndex].data[messageIndex] = message;
        } else {
          messagesWithDates[dateGroupIndex].data.push(message);
        }
        // Sort messages in the date group
        messagesWithDates[dateGroupIndex].data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sort messagesWithDates by date
        messagesWithDates.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    updateMessage(
      state,
      action: PayloadAction<{ id: string; message: ChatMessage }>
    ) {
      const { id, message } = action.payload;
      const chatId = message.chatId;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messagesWithDates = chat.messagesWithDates || [];
        const messageDate = moment(message.createdAt).toDate();

        let dateGroupIndex = messagesWithDates.findIndex((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (dateGroupIndex !== -1) {
          const data = messagesWithDates[dateGroupIndex].data || [];
          const messageIndex = data.findIndex((m) => m.id === id);
          if (messageIndex !== -1) {
            data[messageIndex] = message;
          }
          messagesWithDates[dateGroupIndex]["data"] = data;
        }
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    removeMessage(state, action: PayloadAction<string>) {
      const messageId = action.payload;
      state.chats.forEach((chat) => {
        chat.messagesWithDates.forEach((dateGroup) => {
          dateGroup.data = dateGroup.data.filter((msg) => msg.id !== messageId);
        });
        // Remove empty date groups
        chat.messagesWithDates = chat.messagesWithDates.filter(
          (dateGroup) => dateGroup.data.length > 0
        );
      });
    },
    setChats(state, action: PayloadAction<GetChatsResponse>) {
      const response = action.payload;
      const page = response.page ?? 1;

      if (page === 1) {
        state.chats = response.data;

        return;
      }
      state.chats = [...state.chats, ...response.data];
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
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChats.matchFulfilled,
      (state, action) => {
        const response = action.payload;

        const page = response.page ?? 1;
        if (page === 1) {
          state.chats = response.data;

          return;
        }
        state.chats = _.uniqBy([...state.chats, ...response.data], "id");
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
      }
    );

    // Update chatGroups on editChatGroup
    builder.addMatcher(
      chatApi.endpoints.editChatGroup.matchFulfilled,
      (state, action) => {
        const updatedGroup = action.payload;
        const chatIndex = state.chats.findIndex(
          (chat) => chat.id === updatedGroup.id
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            group: {
              ...state.chats[chatIndex].group,
              ...(updatedGroup as ChatGroup),
            },
          };
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChatMessages.matchFulfilled,
      (state, action) => {
        const response = action.payload;
        const chatId = response.chatId;
        const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIndex === -1) return;

        const chat = state.chats[chatIndex];
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates: response.data,
        };
      }
    );
  },
});

export const {
  setChats,
  updateChat,
  addChat,
  addMessage,
  removeChat,
  removeMessage,
  upsertMessage,
  updateMessage,
} = chatSlice.actions;

export const selectChats = (state: RootState) => state.chats.chats;

export default chatSlice.reducer;
