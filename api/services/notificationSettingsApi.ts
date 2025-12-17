import { createApi } from "@reduxjs/toolkit/query/react";
import API_ROUTES from "@/api/routes";
import { baseQueryWithReAuth } from "./baseApi";

export interface NotificationSettingsResponse {
  id: string;
  profileId: string;
  jobInterviewScheduledSystem: boolean;
  jobInterviewScheduledEmail: boolean;
  connectionRequestSystem: boolean;
  connectionRequestEmail: boolean;
  newJobOpeningSystem: boolean;
  newJobOpeningEmail: boolean;
  interviewReminderSystem: boolean;
  interviewReminderEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsRequest {
  jobInterviewScheduledSystem: boolean;
  jobInterviewScheduledEmail: boolean;
  connectionRequestSystem: boolean;
  connectionRequestEmail: boolean;
  newJobOpeningSystem: boolean;
  newJobOpeningEmail: boolean;
  interviewReminderSystem: boolean;
  interviewReminderEmail: boolean;
}

export const notificationSettingsApi = createApi({
  reducerPath: "notificationSettingsApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => ({
        url: API_ROUTES.notificationSettings.me,
        method: "GET",
      }),
    }),
    updateNotificationSettings: builder.mutation<
      NotificationSettingsResponse,
      UpdateNotificationSettingsRequest
    >({
      query: (body) => ({
        url: API_ROUTES.notificationSettings.me,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationSettingsApi;
