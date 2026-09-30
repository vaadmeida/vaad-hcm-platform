import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOnboardingMaterial } from "../api/onboardingApi";
import { toast } from "sonner";

export const useDeleteOnboardingMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOnboardingMaterial,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-materials"],
      });

      toast.success(response.message);
    },
  });
};