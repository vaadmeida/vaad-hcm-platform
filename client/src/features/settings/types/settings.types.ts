export interface UpdateMyProfilePayload {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatedProfile {
  id: string;
  employee_code: string;
  full_name: string;
  avatar_url: string | null;
  personal: {
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
    phone: string | null;
  };
  employment: {
    job_title: string;
  };
}

export interface UpdateMyProfileResponse {
  success: boolean;
  message: string;
  data: UpdatedProfile;
}


export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  email: string | null;
  company_size: string | null;
  phone: string | null;
  website: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}

export interface UpdateOrganizationPayload {
  name?: string;
  industry?: string;
  email?: string;
  company_size?: string;
  phone?: string;
  website?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateOrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}
