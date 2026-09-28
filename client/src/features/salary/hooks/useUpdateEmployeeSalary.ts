import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeSalaryDTO } from "../types/salary.types";
import { updateEmployeeSalary } from "../api/salaries.api";

export const useUpdateEmployeeSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: string;
      payload: Partial<CreateEmployeeSalaryDTO>;
    }) => updateEmployeeSalary(employeeId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee-salary", variables.employeeId],
      });
    },
  });
};