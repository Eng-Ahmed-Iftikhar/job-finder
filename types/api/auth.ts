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
  username: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  generalInfo?: UserGeneralInfo;
  location?: UserLocation;
  phoneNumber?: UserPhoneNumber;
  pictureUrl?: string;
  resumeUrl?: string;
};
