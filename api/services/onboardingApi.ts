import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

const auth = getAuth();

export const onboardingApi = createApi({
  reducerPath: "onboardingApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // sign in
    signIn: builder.mutation<
      { user: FirebaseAuthTypes.User; token: string },
      { email: string; password: string }
    >({
      queryFn: async (body) => {
        const { email, password } = body;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        const { token = "" } = (await user.getIdTokenResult()) || "";

        if (user) {
          return {
            data: { user, token },
          };
        } else {
          return { error: { status: 401, data: "Authentication failed" } };
        }
      },
    }),
    // sign up
    signUp: builder.mutation<
      { user: FirebaseAuthTypes.User; token: string },
      {
        email: string;
        password: string;
      }
    >({
      queryFn: async (body) => {
        const { email, password } = body;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const { token = "" } = (await user.getIdTokenResult()) || "";
        if (user) {
          return {
            data: { user, token },
          };
        } else {
          return { error: { status: 401, data: "Authentication failed" } };
        }
      },
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = onboardingApi;
