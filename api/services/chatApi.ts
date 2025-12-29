import API_ROUTES from "@/api/routes";
import {
  CreateChatRequest,
  GetChatsResponse,
  GetChatsRequest,
  GetChatMessageRequest,
  GetChatMessagesResponse,
  CreateChatMessageRequest,
  EditChatGroupRequest,
  EditChatGroupResponse,
} from "@/types/api/chat";
import { Chat, ChatMessage, MessageUserStatus } from "@/types/chat";
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

    editChatGroup: builder.mutation<
      EditChatGroupResponse,
      { chatId: string; body: EditChatGroupRequest }
    >({
      query: ({ chatId, body }) => ({
        url: API_ROUTES.chat.editGroup.replace(":chatId", chatId),

        method: "PATCH",
        body,
      }),
    }),
    getChat: builder.query<Chat, string>({
      query: (id) => ({
        url: API_ROUTES.chat.getChat.replace(":chatId", id),
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
        body: CreateChatMessageRequest;
        signal?: AbortSignal;
      }
    >({
      query: ({ id, body, signal }) => ({
        url: API_ROUTES.chat.sendMessage.replace(":chatId", id),
        method: "POST",
        body,
        signal,
      }),
    }),
    updateMessageStatus: builder.mutation<
      ChatMessage,
      {
        statusId: string;
        receivedAt?: Date;
        seenAt?: Date;
        signal?: AbortSignal;
      }
    >({
      query: ({ statusId, receivedAt, seenAt, signal }) => ({
        url: API_ROUTES.chat.statusUpdate.replace(":statusId", statusId),
        method: "PATCH",
        body: { receivedAt, seenAt },
        signal,
      }),
    }),

    getAllUnreadMessage: builder.query<ChatMessage[], void>({
      query: () => ({
        url: API_ROUTES.chat.unReadMessages,
        method: "GET",
      }),
    }),
    getChatMessageDates: builder.query<Date[], string>({
      query: (chatId) => ({
        url: API_ROUTES.chat.messageDates.replace(":chatId", chatId),
        method: "GET",
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
  useUpdateMessageStatusMutation,
  useGetAllUnreadMessageQuery,
  useGetChatQuery,
  useEditChatGroupMutation,
  useGetChatMessageDatesQuery,
} = chatApi;
