import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";

const auth = getAuth();

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // sign in
    signIn: builder.mutation<
      { user: FirebaseAuthTypes.User },
      { email: string; password: string }
    >({
      queryFn: async (body) => {
        const { email, password } = body;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        if (user) {
          return { data: { user } };
        } else {
          return { error: { status: 401, data: "Authentication failed" } };
        }
      },
    }),
    // sign up
    signUp: builder.mutation<
      { user: FirebaseAuthTypes.User },
      {
        email: string;
        password: string;
      }
    >({
      queryFn: async (body) => {
        const { email, password } = body;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (user) {
          return { data: { user } };
        } else {
          return { error: { status: 401, data: "Authentication failed" } };
        }
      },
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
