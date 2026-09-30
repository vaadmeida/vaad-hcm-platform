import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOnboardingMaterial } from "../api/onboardingApi";
import { toast } from "sonner";

export const useUpdateOnboardingMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => updateOnboardingMaterial(id, formData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-materials"],
      });

      toast.success(response.message);
    },
  });
};