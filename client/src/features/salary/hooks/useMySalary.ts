import { useQuery } from "@tanstack/react-query";
import { getMySalary } from "../api/salaries.api";

export const useMySalary = () => {
  return useQuery({
    queryKey: ["my-salary"],
    queryFn: getMySalary,
  });
};