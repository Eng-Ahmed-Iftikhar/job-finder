import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { authApi } from "@/api/services/authApi";
import { userApi } from "@/api/services/userApi";
import { User } from "@/types/api/auth";

// Define a type for the slice state
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle /me endpoint
      .addMatcher(authApi.endpoints.me.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch user data";
      })
      // Handle general info update
      .addMatcher(userApi.endpoints.updateGeneralInfo.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.updateGeneralInfo.matchFulfilled,
        (state, action) => {
          console.log("General info update payload:", action.payload);
          if (state.user) {
            state.user.firstName = action.payload.firstName;
            state.user.lastName = action.payload.lastName;
            state.user.email = action.payload.email;
          }
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.updateGeneralInfo.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to update general info";
        }
      )
      // Handle location update
      .addMatcher(userApi.endpoints.updateLocation.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.updateLocation.matchFulfilled,
        (state, action) => {
          console.log("Location update payload:", action.payload);
          if (state.user && state.user.profile) {
            state.user.profile.location = {
              country: action.payload.country,
              state: action.payload.state,
              city: action.payload.city,
              address: action.payload.address,
            };
            state.user.profile.pictureUrl =
              action.payload.pictureUrl || undefined;
            state.user.profile.resumeUrl =
              action.payload.resumeUrl || undefined;
          }
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.updateLocation.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to update location";
        }
      )
      // Handle phone number update
      .addMatcher(userApi.endpoints.updatePhoneNumber.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.updatePhoneNumber.matchFulfilled,
        (state, action) => {
          console.log("Phone number update payload:", action.payload);
          if (state.user && state.user.profile) {
            state.user.profile.phoneNumber = {
              countryCode: action.payload.countryCode,
              number: parseInt(action.payload.number),
              isVerified: action.payload.isVerified,
            };
          }
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.updatePhoneNumber.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to update phone number";
        }
      )
      // Handle resume update
      .addMatcher(userApi.endpoints.updateResume.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.updateResume.matchFulfilled,
        (state, action) => {
          console.log("Resume update payload:", action.payload);
          if (state.user && state.user.profile) {
            state.user.profile.resumeUrl = action.payload.resumeUrl;
          }
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        userApi.endpoints.updateResume.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to update resume";
        }
      )
      // Handle login/signup success
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.socialLogin.matchFulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout API fails, we should still clear local state
        state.isLoggedIn = false;
        state.user = null;
      });

    // Handle login/signup success
  },
});

export const { setUser, setLoggedIn, setUserLoading, setUserError, clearUser } =
  userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
