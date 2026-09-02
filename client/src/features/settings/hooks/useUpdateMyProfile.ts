import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMyProfile } from "../api/settings.api";
import type { UpdateMyProfilePayload } from "../types/settings.types";

import { useAuthStore } from "@/store/auth.store";

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateMyProfilePayload) =>
      updateMyProfile(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["my-profile", user?.id],
      });

      if (!user) return;

      const updatedProfile = response.data;

      setUser({
        ...user,
        first_name: updatedProfile.personal.first_name,
        last_name: updatedProfile.personal.last_name,
        email: updatedProfile.personal.email,
      });
    },
  });
};
