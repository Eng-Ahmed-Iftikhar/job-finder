import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { User } from "@/types/api/auth";

// Define the update general info request payload
export interface UpdateGeneralInfoRequest {
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
}

// Define the update location request payload
export interface UpdateLocationRequest {
  country: string;
  state: string;
  city: string;
  address: string;
}

// Define the update phone number request payload
export interface UpdatePhoneNumberRequest {
  countryCode: string;
  number: number;
  isVerified: boolean;
}

// Define the update general info response
export interface UpdateGeneralInfoResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  socialProvider: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the update location response
export interface UpdateLocationResponse {
  id: string;
  userId: string;
  city: string;
  state: string;
  country: string;
  address: string;
  pictureUrl: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define the update phone number response
export interface UpdatePhoneNumberResponse {
  id: string;
  userId: string;
  profileId: string;
  countryCode: string;
  number: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the update resume request payload
export interface UpdateResumeRequest {
  resumeUrl: string;
  fileName: string;
}

// Define the update resume response
export interface UpdateResumeResponse {
  id: string;
  userId: string;
  profileId: string;
  resumeUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

// Define the update profile picture request payload
export interface UpdateProfilePictureRequest {
  pictureUrl: string;
}

// Define the update profile picture response
export interface UpdateProfilePictureResponse {
  id: string;
  userId: string;
  profileId: string;
  pictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // update general info (requires auth)
    updateGeneralInfo: builder.mutation<
      UpdateGeneralInfoResponse,
      UpdateGeneralInfoRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.me,
        method: "PUT",
        body,
      }),
    }),
    // update location (requires auth)
    updateLocation: builder.mutation<
      UpdateLocationResponse,
      UpdateLocationRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.profile,
        method: "PUT",
        body,
      }),
    }),
    // update phone number (requires auth)
    updatePhoneNumber: builder.mutation<
      UpdatePhoneNumberResponse,
      UpdatePhoneNumberRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.phoneNumber,
        method: "PUT",
        body,
      }),
    }),
    // update resume (requires auth)
    updateResume: builder.mutation<UpdateResumeResponse, UpdateResumeRequest>({
      query: (body) => ({
        url: API_ROUTES.user.resume,
        method: "PUT",
        body,
      }),
    }),
    // update profile picture (requires auth)
    updateProfilePicture: builder.mutation<
      UpdateProfilePictureResponse,
      UpdateProfilePictureRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.profile,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useUpdateGeneralInfoMutation,
  useUpdateLocationMutation,
  useUpdatePhoneNumberMutation,
  useUpdateResumeMutation,
  useUpdateProfilePictureMutation,
} = userApi;
