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
};

type UserPhoneNumber = {
  countryCode: string;
  number: number;
  isVerified: boolean;
};

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  EMPLOYER = "EMPLOYER",
  CANDIDATE = "CANDIDATE",
}

export type User = {
  id: string;
  email: string;
  password?: string; // Optional for social logins
  isActive: boolean;
  provider: SocialProvider;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  generalInfo?: UserGeneralInfo;
  location?: UserLocation;
  phoneNumber?: UserPhoneNumber;
  pictureUrl?: string;
  resumeUrl?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
};

// Google login response type
export interface GoogleUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}
