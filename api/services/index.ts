import { Middleware, Reducer } from "@reduxjs/toolkit";

// project imports
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import { fileApi } from "./fileApi";

export const apiMiddlewares: Middleware[] = [
  authApi.middleware,
  userApi.middleware,
  fileApi.middleware,
];

export const apiReducers: Record<string, Reducer> = {
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
};
