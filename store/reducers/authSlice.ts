import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/types/api/auth";
import { RootState } from ".";

// Define a type for the slice state
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token?: {
    accessToken: string;
    expiresAt: string;
  };
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: undefined,
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
    setToken: (
      state,
      action: PayloadAction<
        { accessToken: string; expiresAt: string } | undefined
      >
    ) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = undefined;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.auth;

export default authSlice.reducer;
