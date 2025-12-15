import API_ROUTES from "@/api/routes";
import { SocialProvider, User } from "@/types/api/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

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
        url: API_ROUTES.user.me,
        method: "GET",
      }),
    }),
    // send phone verification code (no auth required)
    sendPhoneVerification: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_ROUTES.auth.send_phone_verification,
        method: "POST",
      }),
    }),
    // verify phone verification code (no auth required)
    verifyPhoneCode: builder.mutation<
      { message: string; verified: boolean },
      { verificationCode: string }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.verify_phone_code,
        method: "POST",
        body,
      }),
    }),
    // send email verification code (requires auth)
    sendEmailVerification: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_ROUTES.auth.send_email_verification,
        method: "POST",
      }),
    }),
    // verify email code (requires auth)
    verifyEmailCode: builder.mutation<
      { message: string; verified: boolean },
      { verificationCode: string }
    >({
      query: (body) => ({
        url: API_ROUTES.auth.verify_email_code,
        method: "POST",
        body,
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
  useLazyMeQuery,
  useSendPhoneVerificationMutation,
  useVerifyPhoneCodeMutation,
  useSendEmailVerificationMutation,
  useVerifyEmailCodeMutation,
} = authApi;
