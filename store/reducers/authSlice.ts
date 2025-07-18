import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { authApi } from "@/api/services/authApi";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Define a type for the slice state
interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoggedIn: boolean;
  token?: string;
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
    setUser: (state, action: PayloadAction<FirebaseAuthTypes.User | null>) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.isLoggedIn = true;
        state.token = token;
        state.user = user;
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = undefined;
      })
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.isLoggedIn = true;
        state.token = token;
        state.user = user;
      })
      .addMatcher(authApi.endpoints.signUp.matchRejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = undefined;
      });
  },
});

export const { setToken, setUser, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
