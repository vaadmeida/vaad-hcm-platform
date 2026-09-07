import type { LoginFormData } from "@/features/auth/validations/login.schema"
import { api } from "../../../lib/axios.api"
import type { ChangePasswordPayload, LoginResponse } from "@/features/auth/types/auth.types"

export const login = async(data: LoginFormData): Promise<LoginResponse> =>{
 
    const response  = await api.post<LoginResponse>('/api/auth/login', data)
    return response.data
}


export const changePassword = async ( data: ChangePasswordPayload) => {
  const response = await api.post("/api/auth/change-password", data );

  return response.data;
};