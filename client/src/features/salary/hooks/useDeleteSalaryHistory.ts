import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteSalaryHistory } from "../api/salaries.api";

export const useDeleteSalaryHistory = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salaryId: string) =>
      deleteSalaryHistory({ employeeId, salaryId }),

    onSuccess: async ({ message }) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ["employee-salary-history", employeeId],
      });
    },

    onError: (error) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message ?? "Couldn’t delete the salary history entry.");
    },
  });
};