import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateEmployee } from "../api/employees.api";

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) =>
      deactivateEmployee(employeeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};