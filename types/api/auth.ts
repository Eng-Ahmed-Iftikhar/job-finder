import { Profile, SocialProvider, User } from "../user";

export interface AuthMeResponse {
  user: User;
  profile: Profile;
}

// Define the server auth response
export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  provider: SocialProvider;
  profileImage?: string;
  accessToken?: string; // For additional verification if needed
}

// Define the refresh token response
export interface RefreshTokenResponse {
  access_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyResetCodeRequest {
  code: string;
  email: string;
}

export interface VerifyResetCodeResponse {
  message: string;
  verified: boolean;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
