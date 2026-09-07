export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "hr" | "manager" | "employee";
  avatar_url?: string | null;
  employee_code?: string;
}

export interface LoginResponse {
  status: string;
  success: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  status: number;
  code: string;
  message: string;
  detail: null;
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  detail: unknown;
}