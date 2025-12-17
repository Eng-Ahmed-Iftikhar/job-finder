import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseApi";
import API_ROUTES from "@/api/routes";
import { User, UserEmail, UserProfile } from "@/types/api/auth";

// Define the update general info request payload
export interface UpdateGeneralInfoRequest {
  firstName: string;
  lastName: string;
  email?: string;
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
  number: string;
  isVerified: boolean;
}

// Define the create phone number request payload
export interface CreatePhoneNumberRequest {
  countryCode: string;
  number: string;
}

export interface CreatePhoneNumberRequest {
  countryCode: string;
  number: string;
}
// Define the update general info response
export interface UpdateGeneralInfoResponse {
  id: string;
  email: UserEmail;
  profile: {
    firstName: string;
    lastName: string;
    role: string;
  };

  isActive: boolean;
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
  phoneNumber: {
    countryCode: string;
    number: string;
    isVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Define the create phone number response
export interface CreatePhoneNumberResponse {
  id: string;
  userId: string;
  profileId: string;
  phoneNumber: {
    countryCode: string;
    number: string;
    isVerified: boolean;
  };
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

// Define experience input
export interface ExperienceInput {
  position: string;
  company: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  isCurrent?: boolean;
}

// Define education input
export interface EducationInput {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  yearStarted: number;
  yearGraduated?: number;
  inProgress?: boolean;
}

// Define CV details request payload
export interface UpdateCvDetailsRequest {
  experiences?: ExperienceInput[];
  educations?: EducationInput[];
  skillIds?: string[];
  bio?: string;
  resumeUrl?: string;
}

// Define CV details response
export interface UpdateCvDetailsResponse {
  id: string;
  userId: string;
  experiences?: ExperienceInput[];
  educations?: EducationInput[];
  skillIds?: string[];
  bio?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReauthenticateRequest {
  password: string;
}

export interface ReauthenticateResponse {
  isAuthenticated: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
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
    // create phone number (requires auth)
    createPhoneNumber: builder.mutation<
      CreatePhoneNumberResponse,
      CreatePhoneNumberRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.phoneNumber,
        method: "POST",
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
    // get CV details (requires auth)
    getCvDetails: builder.query<UpdateCvDetailsResponse, void>({
      query: () => ({
        url: `${API_ROUTES.user.me}/cv-details`,
        method: "GET",
      }),
    }),
    // update CV details (requires auth)
    updateCvDetails: builder.mutation<
      UpdateCvDetailsResponse,
      UpdateCvDetailsRequest
    >({
      query: (body) => ({
        url: `${API_ROUTES.user.me}/cv-details`,
        method: "PUT",
        body,
      }),
    }),
    // reauthenticate current user (requires auth)
    reauthenticate: builder.mutation<
      ReauthenticateResponse,
      ReauthenticateRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.reauthenticate,
        method: "POST",
        body,
      }),
    }),
    // change password (requires auth)
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: API_ROUTES.user.changePassword,
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
  useCreatePhoneNumberMutation,
  useUpdateResumeMutation,
  useUpdateProfilePictureMutation,
  useGetCvDetailsQuery,
  useUpdateCvDetailsMutation,
  useReauthenticateMutation,
  useChangePasswordMutation,
} = userApi;
