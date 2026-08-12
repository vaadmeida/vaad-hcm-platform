import { useQuery } from "@tanstack/react-query";
import { getTeamStatusBreakdown } from "../api/department.api";

export const useTeamStatusBreakdown = (departmentId: string) => {
  return useQuery({
    queryKey: ["department-status-breakdown", departmentId],
    queryFn: () => getTeamStatusBreakdown(departmentId),
    enabled: !!departmentId,
  });
};