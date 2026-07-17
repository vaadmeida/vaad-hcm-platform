import type { User } from "@/features/auth/types/auth.types";

export const getDashboardRoute = (role: User["role"]): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "hr":
      return "/hr/dashboard";

    case "manager":
      return "/manager/dashboard";

    case "employee":
      return "/employee/dashboard";

    default:
      return "/login";
  }
};