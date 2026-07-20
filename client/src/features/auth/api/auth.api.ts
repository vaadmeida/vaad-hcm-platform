import type { LoginFormData } from "@/features/auth/validations/login.schema"
import { api } from "../../../lib/axios.api"
import type { LoginResponse } from "@/features/auth/types/auth.types"

export const login = async(data: LoginFormData): Promise<LoginResponse> =>{
 
    const response  = await api.post('/api/auth/login', data)
    return response.data
     
}