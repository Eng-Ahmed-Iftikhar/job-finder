import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { authApi } from "@/api/services/authApi";
import { userApi } from "@/api/services/userApi";
import { jobsApi } from "@/api/services/jobsApi";
import { companyApi } from "@/api/services/companyApi";
import { User, UserProfile, UserRole } from "@/types/api/auth";
import { connectionRequestsApi } from "@/api/services/connectionRequestsApi";

// Define a type for the slice state

type Connection = {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    role: string;
    pictureUrl?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
};

type followedCompany = {
  id: string;
  name: string;
  address?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  pictureUrl?: string;
};

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  connections: Connection[];
  followedCompanies: followedCompany[];
  savedJobIds: string[];
  appliedJobIds: string[];
  pendingConnections: string[];
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  profile: null,
  isLoggedIn: false,
  connections: [],
  followedCompanies: [],
  appliedJobIds: [],
  pendingConnections: [],
  savedJobIds: [],
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
    addConnection: (state, action: PayloadAction<Connection>) => {
      if (state.connections.find((conn) => conn.id === action.payload.id)) {
        return;
      }
      state.connections = [...state.connections, action.payload];
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
        state["connections"] = action.payload.connections;
        state["followedCompanies"] = action.payload.followedCompanies ?? [];
        state["savedJobIds"] = action.payload.savedJobIds;
        state["appliedJobIds"] = action.payload.appliedJobIds ?? [];
        state["pendingConnections"] = action.payload.pendingConnections ?? [];
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
            state.profile.location = {
              ...action.payload.location,
              address: action.payload.address,
            };
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

      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout API fails, we should still clear local state
        state.isLoggedIn = false;
        state.user = null;
      })
      .addMatcher(
        jobsApi.endpoints.getSavedJobIds.matchFulfilled,
        (state, action) => {
          state.savedJobIds = action.payload;
        }
      )
      .addMatcher(jobsApi.endpoints.saveJob.matchFulfilled, (state, action) => {
        const jobId = (action as any).meta?.arg?.originalArgs?.jobId as
          | string
          | undefined;
        if (jobId && !state.savedJobIds.includes(jobId)) {
          state.savedJobIds.push(jobId);
        }
      })
      .addMatcher(
        jobsApi.endpoints.unsaveJob.matchFulfilled,
        (state, action) => {
          const jobId = (action as any).meta?.arg?.originalArgs?.jobId as
            | string
            | undefined;
          if (jobId) {
            state.savedJobIds = state.savedJobIds.filter((id) => id !== jobId);
          }
        }
      )
      .addMatcher(
        jobsApi.endpoints.getAppliedJobIds.matchFulfilled,
        (state, action) => {
          state.appliedJobIds = action.payload;
        }
      )
      .addMatcher(
        jobsApi.endpoints.applyJob.matchFulfilled,
        (state, action) => {
          const jobId = (action as any).meta?.arg?.originalArgs?.jobId as
            | string
            | undefined;
          if (jobId && !state.appliedJobIds.includes(jobId)) {
            state.appliedJobIds.push(jobId);
          }
        }
      )
      .addMatcher(
        companyApi.endpoints.followCompany.matchFulfilled,
        (state, action) => {
          const companyId = (action as any).meta?.arg?.originalArgs
            ?.companyId as string | undefined;

          // Get company data from the follow response or from cache
          const companyData = action.payload as any;

          if (companyId) {
            // Check if already following
            const alreadyFollowing = state.followedCompanies.some(
              (company) => company.id === companyId
            );

            if (!alreadyFollowing) {
              // Add company to followedCompanies array
              // Note: You may need to fetch full company data separately
              state.followedCompanies.push({
                id: companyId,
                name: companyData?.company?.name || "",
                address: companyData?.company?.profile?.address,
                location: companyData?.company?.profile?.location,
                pictureUrl: companyData?.company?.profile?.pictureUrl,
              });
            }
          }
        }
      )
      .addMatcher(
        companyApi.endpoints.unfollowCompany.matchFulfilled,
        (state, action) => {
          const companyId = (action as any).meta?.arg?.originalArgs
            ?.companyId as string | undefined;
          if (companyId) {
            state.followedCompanies = state.followedCompanies.filter(
              (company) => company.id !== companyId
            );
          }
        }
      )
      .addMatcher(
        connectionRequestsApi.endpoints.acceptConnectionRequest.matchFulfilled,
        (state, action) => {
          console.log(action.payload);

          const findedRequest = state.pendingConnections.findIndex(
            (id) => id === action.payload.id
          );
          if (findedRequest) return;
          state.connections.push(action.payload);
        }
      )
      .addMatcher(
        companyApi.endpoints.getCompanyById.matchFulfilled,
        (state, action) => {
          // Update followedCompanies with fresh company data
          const company = action.payload;
          const index = state.followedCompanies.findIndex(
            (c) => c.id === company.id
          );

          if (index !== -1) {
            state.followedCompanies[index] = {
              id: company.id,
              name: company.name,
              address: company.profile?.address,
              location: company.profile?.location,
              pictureUrl: company.profile?.pictureUrl,
            };
          }
        }
      );

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
export const selectUserConnections = (state: RootState) =>
  state.user.connections;
export const selectFollowedCompanies = (state: RootState) =>
  state.user.followedCompanies;
export const selectSavedJobIds = (state: RootState) => state.user.savedJobIds;
export const selectAppliedJobIds = (state: RootState) =>
  state.user.appliedJobIds;
export const selectUserError = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectPendingConnections = (state: RootState) =>
  state.user.pendingConnections;

export default userSlice.reducer;
