export type UpdateMyProfileInput = {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone?: string;
};

export type UpdateMyProfileResponse = {
  message: string;
  data: {
    id: string;
    employee_code: string;
    full_name: string;
    personal: {
      first_name: string;
      last_name: string;
      middle_name: string;
      email: string;
      phone: string | null;
    };
    employment: {
      job_title: string;
    };
  };
};

