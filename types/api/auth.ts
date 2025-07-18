export type User = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  profile: UserProfile;
};
export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  user_id: number;
};
