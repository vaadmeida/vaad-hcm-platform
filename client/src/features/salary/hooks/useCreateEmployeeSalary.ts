import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeSalaryDTO } from "../types/salary.types";
import { createEmployeeSalary } from "../api/salaries.api";

export const useCreateEmployeeSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: string;
      payload: CreateEmployeeSalaryDTO;
    }) => createEmployeeSalary(employeeId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee-salary", variables.employeeId],
      });
    },
  });
};