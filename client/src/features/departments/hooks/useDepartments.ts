import { useQuery } from "@tanstack/react-query";
import type { Department } from "../types/departments.types";
import { getDepartments } from "../api/department.api";

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
};