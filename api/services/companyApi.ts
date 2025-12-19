import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getFollowedCompanyIds: builder.query<string[], void>({
      query: () => ({
        url: API_ROUTES.companies.followedIds,
        method: "GET",
      }),
    }),
    followCompany: builder.mutation<
      { message?: string },
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.follow.replace(":id", companyId),
        method: "POST",
      }),
    }),
    unfollowCompany: builder.mutation<
      { message?: string },
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.follow.replace(":id", companyId),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetFollowedCompanyIdsQuery,
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
} = companyApi;
