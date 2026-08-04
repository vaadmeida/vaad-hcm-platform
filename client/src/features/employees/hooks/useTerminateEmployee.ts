import { useMutation, useQueryClient } from "@tanstack/react-query";
import { terminateEmployee } from "../api/employees.api";

export const useTerminateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) =>
      terminateEmployee(employeeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};