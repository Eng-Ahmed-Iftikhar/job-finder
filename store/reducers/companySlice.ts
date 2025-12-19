import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { companyApi } from "@/api/services/companyApi";

export interface CompanyState {
  followedCompanyIds: string[];
}

const initialState: CompanyState = {
  followedCompanyIds: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    addFollowedCompanyId: (state, action: PayloadAction<string>) => {
      if (!state.followedCompanyIds.includes(action.payload)) {
        state.followedCompanyIds.push(action.payload);
      }
    },
    removeFollowedCompanyId: (state, action: PayloadAction<string>) => {
      state.followedCompanyIds = state.followedCompanyIds.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        companyApi.endpoints.getFollowedCompanyIds.matchFulfilled,
        (state, action) => {
          state.followedCompanyIds = action.payload;
        }
      )
      .addMatcher(
        companyApi.endpoints.followCompany.matchFulfilled,
        (state, action) => {
          const companyId = (action as any).meta?.arg?.originalArgs
            ?.companyId as string | undefined;
          if (companyId && !state.followedCompanyIds.includes(companyId)) {
            state.followedCompanyIds.push(companyId);
          }
        }
      )
      .addMatcher(
        companyApi.endpoints.unfollowCompany.matchFulfilled,
        (state, action) => {
          const companyId = (action as any).meta?.arg?.originalArgs
            ?.companyId as string | undefined;
          if (companyId) {
            state.followedCompanyIds = state.followedCompanyIds.filter(
              (id) => id !== companyId
            );
          }
        }
      );
  },
});

export const { addFollowedCompanyId, removeFollowedCompanyId } =
  companySlice.actions;

export default companySlice.reducer;

// Selectors
export const selectFollowedCompanyIds = (state: any) =>
  state.company.followedCompanyIds as string[];
