import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfileAvatar } from "../api/settings.api";
import { useAuthStore } from "@/store/auth.store";

export const useUpdateMyProfileAvatar = () => {
  const queryClient = useQueryClient();

  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: updateMyProfileAvatar,

    onSuccess: (response) => {
      const updatedProfile = response.data;

      // Immediately update the profile displayed by ProfileSettings
      queryClient.setQueryData(
        ["my-profile", user?.id],
        updatedProfile
      );

      // Keep the authenticated user state in sync
      if (user) {
        setUser({
          ...user,
          first_name: updatedProfile.personal.first_name,
          last_name: updatedProfile.personal.last_name,
          email: updatedProfile.personal.email,
          avatar_url: updatedProfile.avatar_url,
        });
      }

      // Refetch so the backend remains the source of truth
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["my-profile", user.id],
        });
      }
    },
  });
};