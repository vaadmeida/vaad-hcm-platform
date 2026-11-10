import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type AxiosError } from "axios";

import type { CreateEmployeeSalaryDTO } from "../types/salary.types";
import { createEmployeeSalary } from "../api/salaries.api";

interface ApiErrorResponse {
  message?: string;
  code?: string;
}

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
      toast.success("Salary structure created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["employee-salary", variables.employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees-salary"],
      });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorCode = error.response?.data?.code;

      if (errorCode === "EMPLOYEE_HAS_EXITED") {
        toast.error("Salary structure cannot be created", {
          description:
          "This employee has exited VAAD. Only active employees are eligible for a new salary structure."
        });

        return;
      }

      toast.error("Failed to create salary structure", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });
};