import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type AxiosError } from "axios";

import type { ReviewEmployeeSalaryDTO } from "../types/salary.types";
import { reviewEmployeeSalary } from "../api/salaries.api";

interface ApiErrorResponse {
  message?: string;
  code?: string;
}

export const useReviewEmployeeSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: string;
      payload: ReviewEmployeeSalaryDTO;
    }) => reviewEmployeeSalary(employeeId, payload),

    onSuccess: (_, variables) => {
      toast.success("Salary reviewed successfully.");

      queryClient.invalidateQueries({
        queryKey: ["employee-salary", variables.employeeId],
      });

    queryClient.invalidateQueries({
        queryKey: ["employee-salary-history", variables.employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees-salary"],
      });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorCode = error.response?.data?.code;

      if (errorCode === "EMPLOYEE_HAS_EXITED") {
        toast.error("Salary review cannot be completed", {
          description:
            "This employee has exited VAAD. Only active employees are eligible for salary reviews.",
        });

        return;
      }

      if (errorCode === "INVALID_EFFECTIVE_DATE") {
        toast.error("Invalid effective date", {
          description:
            "The new salary effective date must be later than the current salary effective date.",
        });

        return;
      }

      toast.error("Failed to review salary", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });
};
