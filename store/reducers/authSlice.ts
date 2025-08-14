import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { authApi } from "@/api/services/authApi";
import { User } from "@/types/api/auth";

// Define a type for the slice state
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  access_token?: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  access_token: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.access_token = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
        const { user, access_token } = action.payload;
        state.isLoggedIn = true;
        state.access_token = access_token;
        state.user = user;
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.access_token = undefined;
      })
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, action) => {
        const { user, access_token } = action.payload;
        state.isLoggedIn = true;
        state.access_token = access_token;
        state.user = user;
      })
      .addMatcher(authApi.endpoints.signUp.matchRejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.access_token = undefined;
      });
  },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
