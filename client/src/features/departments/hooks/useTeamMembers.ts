import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "../api/department.api";

export const useTeamMembers = (departmentId: string) => {
  return useQuery({
    queryKey: ["department-team-members", departmentId],
    queryFn: () => getTeamMembers(departmentId),
    enabled: !!departmentId,
  });
};