import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { User, SocialProvider, GoogleUserInfo } from "@/types/api/auth";

// Define the server auth response
export interface AuthResponse {
  user: User;
  access_token: string;
}

// Define the refresh token response
export interface RefreshTokenResponse {
  access_token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReAuth, // Use baseQueryWithReAuth (it ignores auth endpoints)
  endpoints: (builder) => ({
    // sign in (no auth required) - but will use baseQueryWithReAuth for refresh logic
    signIn: builder.mutation<
      AuthResponse,
      { email: string; password: string; rememberMe?: boolean }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.sign_in,
        method: "POST",
        body,
      }),
    }),
    // sign up (no auth required) - handles both email and Google
    signUp: builder.mutation<
      AuthResponse,
      {
        email: string;
        password?: string; // Optional for Google login
        firstName: string;
        lastName: string;
        provider: SocialProvider;
        profileImage?: string;
      }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.sign_up,
        method: "POST",
        body,
      }),
    }),
    // social login (no auth required) - handles Google, Facebook, etc.
    socialLogin: builder.mutation<
      AuthResponse,
      {
        email: string;
        firstName: string;
        lastName: string;
        provider: SocialProvider;
        profileImage?: string;
        accessToken?: string; // For additional verification if needed
      }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.social_login,
        method: "POST",
        body,
      }),
    }),
    // logout (requires auth)
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_ROUTES.auth.logout,
        method: "POST",
      }),
    }),
    // get current user (requires auth)
    me: builder.query<User, void>({
      query: () => ({
        url: API_ROUTES.auth.me,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSocialLoginMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;
