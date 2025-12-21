import { SuggestedJobResponseItem } from "@/api/services/jobsApi";

export type SearchJob = {
  id: string;
  name: string;
  jobType: SuggestedJobResponseItem["jobType"];
  wage: SuggestedJobResponseItem["wage"];
  wageRate: SuggestedJobResponseItem["wageRate"];
  address: string;
  location: Location;
  employers: EmployerRelation[];
};

export type Location = {
  city: string;
  state: string;
  country: string;
};

export type EmployerRelation = {
  employer: Employer;
};

export type Employer = {
  companyProfiles: CompanyProfile[];
};

export type CompanyProfile = {
  company: Company;
};

export type Company = {
  name: string;
};

export type SearchUser = {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
};

export type SearchCompany = {
  id: string;
  pictureUrl: string;
  company: {
    id: string;
    name: string;
  };
};
