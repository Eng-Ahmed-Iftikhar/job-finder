import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { SuggestedJobResponse } from "./jobsApi";
import { SuggestedCompaniesResponse } from "@/types/search/suggestedCompanies";

export interface CompanyLocation {
  id: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface CompanyProfile {
  id: string;
  employerId?: string;
  companyId?: string;
  locationId?: string;
  address?: string;
  status?: string;
  websiteId?: string;
  website?: {
    id: string;
    url?: string;
    name?: string;
  };
  pictureUrl?: string;
  about?: string;
  location?: CompanyLocation;
}

export interface CompanyDetail {
  id: string;
  name: string;
  profile?: CompanyProfile;
  followers?: Array<{
    id: string;
    companyId: string;
    followerId: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  }>;
}

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
    getCompanyById: builder.query<CompanyDetail, { companyId: string }>({
      query: ({ companyId }) => ({
        url: API_ROUTES.companies.detail.replace(":id", companyId),
        method: "GET",
      }),
    }),
    getCompanyJobs: builder.query<
      SuggestedJobResponse,
      { companyId: string; page?: number; pageSize?: number }
    >({
      query: ({ companyId, page = 1, pageSize = 10 }) => ({
        url: API_ROUTES.companies.jobs.replace(":id", companyId),
        method: "GET",
        params: { page, pageSize },
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
    getSuggestedCompanies: builder.query<
      SuggestedCompaniesResponse,
      { search?: string; page: number; pageSize: number; location: string }
    >({
      query: ({ search = "", page = 1, pageSize = 10, location }) => ({
        url: API_ROUTES.companies.all,
        method: "GET",
        params: { search, page, pageSize, location },
      }),
    }),
  }),
});

export const {
  useGetFollowedCompanyIdsQuery,
  useGetCompanyByIdQuery,
  useGetCompanyJobsQuery,
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
  useGetSuggestedCompaniesQuery,
} = companyApi;
