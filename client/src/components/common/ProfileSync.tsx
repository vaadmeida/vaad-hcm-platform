import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useGetMyProfile } from "@/features/my-profile/hooks/useGetMyProfile";

const ProfileSync = () => {
  const { data: profile } = useGetMyProfile();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!profile || !user) return;

    if (
      user.avatar_url === profile.avatar_url &&
      user.first_name === profile.personal.first_name &&
      user.last_name === profile.personal.last_name &&
      user.email === profile.personal.email
    ) {
      return;
    }

    setUser({
      ...user,
      first_name: profile.personal.first_name,
      last_name: profile.personal.last_name,
      email: profile.personal.email,
      avatar_url: profile.avatar_url,
    });
  }, [profile, user, setUser]);

  return null;
};

export default ProfileSync;