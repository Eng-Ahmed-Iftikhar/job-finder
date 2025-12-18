import { Middleware, Reducer } from "@reduxjs/toolkit";

// project imports
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import { fileApi } from "./fileApi";
import { skillApi } from "./skillApi";
import { notificationSettingsApi } from "./notificationSettingsApi";
import { jobsApi } from "./jobsApi";

export const apiMiddlewares: Middleware[] = [
  authApi.middleware,
  userApi.middleware,
  fileApi.middleware,
  skillApi.middleware,
  notificationSettingsApi.middleware,
  jobsApi.middleware,
];

export const apiReducers: Record<string, Reducer> = {
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [skillApi.reducerPath]: skillApi.reducer,
  [notificationSettingsApi.reducerPath]: notificationSettingsApi.reducer,
  [jobsApi.reducerPath]: jobsApi.reducer,
};
