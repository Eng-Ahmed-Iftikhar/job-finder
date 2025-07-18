import { Middleware, Reducer } from "@reduxjs/toolkit";

// project imports
import { authApi } from "./authApi";

export const apiMiddlewares: Middleware[] = [authApi.middleware];

export const apiReducers: Record<string, Reducer> = {
  [authApi.reducerPath]: authApi.reducer,
};
