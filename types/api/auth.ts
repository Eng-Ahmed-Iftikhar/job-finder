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
  number: string;
  isVerified: boolean;
};

export type UserProfile = {
  generalInfo: UserGeneralInfo;
  location: UserLocation;
  phoneNumber: UserPhoneNumber;
  pictureUrl?: string;
  resumeUrl?: string;
};
