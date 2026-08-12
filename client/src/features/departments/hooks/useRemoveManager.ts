import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDepartmentManager } from "../api/department.api";

export const useRemoveDepartmentManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
    }: {
      departmentId: string;
    }) => removeDepartmentManager(departmentId),

    onSuccess: (_, variables) => {
      // Refresh team members + manager
      queryClient.invalidateQueries({
        queryKey: ["department-team-members", variables.departmentId],
      });

      // Refresh department details
      queryClient.invalidateQueries({
        queryKey: ["department", variables.departmentId],
      });

      // Refresh departments list
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
};