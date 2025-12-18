import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";

export interface SuggestedJobLocation {
  id: string;
  city: string;
  state: string;
  country: string;
}

export interface SuggestedJobEmployerRef {
  id: string;
  jobId: string;
  employerId: string;
  employer?: {
    id: string;
    emailId?: string;
    companyProfiles?: Array<{
      id?: string;
      company?: {
        id?: string;
        name?: string;
      };
      location?: {
        id?: string;
        city?: string;
        state?: string;
        country?: string;
      };
      website?: {
        id?: string;
        url?: string;
        name?: string;
      };
      address?: string;
      pictureUrl?: string;
      about?: string;
    }>;
  };
}

export interface SuggestedJobResponseItem {
  id: string;
  name: string;
  address?: string;
  locationId?: string;
  description?: string;
  jobType?: string;
  wage?: string;
  wageRate?: string;
  currency?: string;
  hiringStatus?: string;
  status?: string;
  publishAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  location?: SuggestedJobLocation;
  employers?: SuggestedJobEmployerRef[];
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getSuggestedJobs: builder.query<SuggestedJobResponseItem[], void>({
      query: () => ({
        url: API_ROUTES.jobs.suggested,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSuggestedJobsQuery } = jobsApi;
