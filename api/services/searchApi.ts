import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { SearchJob, SearchUser, SearchCompany } from "@/types/search";

export interface SearchPayload {
  text: string;
  location?: string;
}

export interface SearchResponse {
  jobs: {
    data: SearchJob[];
    total: number;
  };
  employees: {
    data: SearchUser[];
    total: number;
  };
  companies: {
    data: SearchCompany[];
    total: number;
  };
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchPayload>({
      query: (payload) => ({
        url: API_ROUTES.search.all,
        method: "GET",
        params: payload,
      }),
      // Do not retain unused cached data to minimize stale flashes
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazySearchQuery, useSearchQuery } = searchApi;
