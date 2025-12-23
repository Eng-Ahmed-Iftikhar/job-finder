import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ConnectionRequestsResponse {
  data: ConnectionRequest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateConnectionRequestPayload {
  receiverId: string;
}

export interface CreateConnectionRequestResponse {
  message: string;
  request: ConnectionRequest;
}

export const connectionRequestsApi = createApi({
  reducerPath: "connectionRequestsApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMeConnectionRequests: builder.query<
      ConnectionRequestsResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: API_ROUTES.connectionRequests.me,
        method: "GET",
        params: { page, pageSize },
      }),
    }),
    acceptConnectionRequest: builder.mutation<
      {
        id: string;
        receiverId: string;
        senderId: string;
        status: string;
        user: {
          firstName: string;
          lastName: string;
          id: string;
          role: string;
          pictureUrl?: string;
        };
      }, // ConnectionRequest},
      string
    >({
      query: (requestId) => ({
        url: API_ROUTES.connectionRequests.accept.replace(":id", requestId),
        method: "PATCH",
      }),
    }),
    createConnectionRequest: builder.mutation<
      CreateConnectionRequestResponse,
      CreateConnectionRequestPayload
    >({
      query: (body) => ({
        url: API_ROUTES.connectionRequests.create,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetMeConnectionRequestsQuery,
  useCreateConnectionRequestMutation,
  useAcceptConnectionRequestMutation,
} = connectionRequestsApi;
