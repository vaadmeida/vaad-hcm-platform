export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "hr" | "manager" | "employee";
}

export interface LoginResponse {
  status: string;
  success: string;
  data: {
    user: User;
    token: string;
  };
}