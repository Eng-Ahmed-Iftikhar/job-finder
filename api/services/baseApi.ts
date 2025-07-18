import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Constants from "expo-constants";

import { SIGN_IN_PATH } from "@/config";
import { RootState } from "@/store/reducers";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
console.log("RTK BaseURL:", BASE_URL);

// BaseQuery without auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

// BaseQuery with auth headers
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const session = (await getState()) as RootState;
    const accessToken = session?.auth?.token?.accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// BaseQuery with auth headers and re-auth if 401
const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    !window.location.href.includes("/sign-in")
  ) {
    // Redirect to sign-in
    // await signOut({ redirect: false });
    window.location.pathname = SIGN_IN_PATH;
  }
  return result;
};

export { BASE_URL, baseQuery, baseQueryWithAuth, baseQueryWithReAuth };
