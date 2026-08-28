import { useQuery } from "@tanstack/react-query";
import type { Manager } from "../types/employee.types";
import { getManagers } from "../api/employees.api";

export const useManagers = (options?: { enabled?: boolean }) => {
  return useQuery<Manager[]>({
    queryKey: ["managers"],
    queryFn: getManagers,
    enabled: options?.enabled ?? true,
  });
};