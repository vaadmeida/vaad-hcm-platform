import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrganizationPayload } from "../types/settings.types";
import { updateOrganization } from "../api/settings.api";

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationPayload) => updateOrganization(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-settings"],
      });
    },
  });
};
