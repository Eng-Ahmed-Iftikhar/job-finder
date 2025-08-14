import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { User } from "@/types/api/auth";

// Define the server auth response
export interface AuthResponse {
  user: User;
  access_token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    // sign in
    signIn: builder.mutation<AuthResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: API_ROUTES.auth.sign_in,
          method: "POST",
          body,
        }),
      }
    ),
    // sign up
    signUp: builder.mutation<
      AuthResponse,
      {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
      }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.sign_up,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
