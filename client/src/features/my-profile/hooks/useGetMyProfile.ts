import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/my-profile.api";
import { useAuthStore } from "@/store/auth.store";

export const useGetMyProfile = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: getMyProfile,
    enabled: !!user?.id,
  });
};