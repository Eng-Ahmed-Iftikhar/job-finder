import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { authApi } from "@/api/services/authApi";
import { userApi } from "@/api/services/userApi";
import { User, UserProfile, UserRole } from "@/types/api/auth";

// Define a type for the slice state
interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  profile: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state["user"] = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state["profile"] = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.isLoggedIn = false;
    },
    updateIsOnboarded: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.isOnboarded = action.payload;
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      if (state.user && state.user.email) {
        state.user.email.isVerified = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, action) => {
        if (action.payload.profile.role !== UserRole.EMPLOYEE) return;
        state["user"] = action.payload.user;
        state["profile"] = action.payload.profile;
        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
      })
      .addMatcher(
        userApi.endpoints.updateGeneralInfo.matchFulfilled,
        (state, action) => {
          if (state.user) {
            if (state.user.email.email !== action.payload.email.email) {
              state.user.email = action.payload.email;
            }
            if (state.profile) {
              if (!state.profile.generalInfo) {
                state.profile.generalInfo = {
                  firstName: "",
                  lastName: "",
                };
              }
              state.profile.generalInfo.firstName =
                action.payload.profile.firstName;
              state.profile.generalInfo.lastName =
                action.payload.profile.lastName;
            }
          }
        }
      )
      .addMatcher(
        userApi.endpoints.updateLocation.matchFulfilled,
        (state, action) => {
          if (state.user && state.profile) {
            state.profile.location = action.payload.location;
            state.profile.pictureUrl = action.payload.pictureUrl || undefined;
            state.profile.resumeUrl = action.payload.resumeUrl || undefined;
          }
        }
      )

      .addMatcher(
        userApi.endpoints.updatePhoneNumber.matchFulfilled,
        (state, action) => {
          if (state.user && state.profile) {
            state.profile.phoneNumber = action.payload.phoneNumber;
          }
        }
      )
      .addMatcher(
        userApi.endpoints.updateResume.matchFulfilled,
        (state, action) => {
          if (state.user && state.profile) {
            state.profile.resumeUrl = action.payload.resumeUrl;
          }
        }
      )
      // Handle login/signup success
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
        state.isLoggedIn = true;
      })
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, action) => {
        state.isLoggedIn = true;
      })
      .addMatcher(
        authApi.endpoints.socialLogin.matchFulfilled,
        (state, action) => {
          state.isLoggedIn = true;
        }
      )
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

export const {
  setUser,
  updateProfile,
  setLoggedIn,
  setUserProfile,
  clearUser,
  updateIsOnboarded,
  setEmailVerified,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserError = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
