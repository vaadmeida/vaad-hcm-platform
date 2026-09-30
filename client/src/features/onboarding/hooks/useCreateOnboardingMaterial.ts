import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOnboardingMaterial } from "../api/onboardingApi";
import { toast } from "sonner";

export const useCreateOnboardingMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOnboardingMaterial,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-materials"],
      });

      toast.success(response.message);
    },
  });
};