import { useQuery } from "@tanstack/react-query";
import type { Manager } from "../types/employee.types";
import { getManagers } from "../api/employees.api";

export const useManagers = () => {
  return useQuery<Manager[]>({
    queryKey: ["managers"],
    queryFn: getManagers,
  });
};