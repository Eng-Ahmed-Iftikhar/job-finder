export enum SocialProvider {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  LINKEDIN = "LINKEDIN",
  GITHUB = "GITHUB",
}

type UserGeneralInfo = {
  firstName: string;
  lastName: string;
};

type UserLocation = {
  city: string;
  state: string;
  country: string;
  address: string;
  id?: string;
};

export type UserPhoneNumber = {
  countryCode: string;
  number: string;
  isVerified: boolean;
};

export enum UserRole {
  EMPLOYER = "EMPLOYER",
  EMPLOYEE = "EMPLOYEE",
}

export type User = {
  id: string;
  email: UserEmail;
  password?: string; // Optional for social logins
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface AuthMeResponse {
  user: User;
  profile: UserProfile;
  connections: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      id: string;
      role: string;
      pictureUrl?: string;
    };
  }[];
  followedCompanies: {
    id: string;
    name: string;
    address?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    pictureUrl?: string;
  }[];
  savedJobIds: string[];
  appliedJobIds: string[];
}

export interface UserEmail {
  email: string;
  isVerified: boolean;
  provider: SocialProvider;
}

export type UserProfile = {
  generalInfo?: UserGeneralInfo;
  location?: UserLocation;
  phoneNumber?: UserPhoneNumber;
  pictureUrl?: string;
  resumeUrl?: string;
  role?: UserRole;
  isOnboarded?: boolean;
};

// Google login response type
export interface GoogleUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}
