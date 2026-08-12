import { useQuery } from "@tanstack/react-query";
import { getTeamRecentActivities } from "../api/department.api";

export const useTeamRecentActivities = (departmentId: string) => {
  return useQuery({
    queryKey: ["department-recent-activities", departmentId],
    queryFn: () => getTeamRecentActivities(departmentId),
    enabled: !!departmentId,
  });
};