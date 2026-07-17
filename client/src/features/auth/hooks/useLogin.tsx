import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "../api/auth.api";

import { useAuthStore } from "@/store/auth.store";

export function useLogin() {

  const saveLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess(response) {
      saveLogin(
        response.data.user,
        response.data.token
      );

      toast.success("Welcome back!");
    },

    onError() {
      toast.error(
        "Invalid email or password."
      );
    },
  });
}