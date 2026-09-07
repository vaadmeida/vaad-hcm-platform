import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { ApiErrorResponse, ChangePasswordPayload, ChangePasswordResponse } from "../types/auth.types";
import { changePassword } from "../api/auth.api";

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, AxiosError<ApiErrorResponse>, ChangePasswordPayload>({
      mutationFn: changePassword,
  });
};