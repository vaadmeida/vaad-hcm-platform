import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignDepartmentManager } from "../api/department.api";
import type { AssignDepartmentManagerDto } from "../types/departments.types";

export const useAssignDepartmentManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      payload,
    }: {
      departmentId: string;
      payload: AssignDepartmentManagerDto;
    }) => assignDepartmentManager(departmentId, payload),

    onSuccess: (_, variables) => {
      // Refresh department team members + manager
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