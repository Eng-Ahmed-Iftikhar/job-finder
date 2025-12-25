import API_ROUTES from "@/api/routes";
import {
  CreateChatRequest,
  GetChatsResponse,
  GetChatsRequest,
  GetChatMessageRequest,
  GetChatMessagesResponse,
} from "@/types/api/chat";
import { Chat, ChatMessage } from "@/types/chat";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (payload) => ({
        url: API_ROUTES.chat.create,
        method: "POST",
        body: payload,
      }),
    }),
    getChats: builder.query<GetChatsResponse, GetChatsRequest>({
      query: (params) => ({
        url: API_ROUTES.chat.getChats,
        method: "GET",
        params,
      }),
    }),
    getChatMessages: builder.query<
      GetChatMessagesResponse,
      GetChatMessageRequest
    >({
      query: ({ id, params }) => ({
        url: API_ROUTES.chat.getMessages.replace(":chatId", id),
        params,
      }),
    }),
    createChatMessage: builder.mutation<
      ChatMessage,
      {
        id: string;
        body: { senderId: string; text: string; messageType: string };
      }
    >({
      query: ({ id, body }) => ({
        url: API_ROUTES.chat.sendMessage.replace(":chatId", id),
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useGetChatMessagesQuery,
  useCreateChatMessageMutation,
} = chatApi;
