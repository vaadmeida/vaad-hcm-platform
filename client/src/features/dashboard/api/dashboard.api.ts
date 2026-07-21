import { api } from "@/lib"
import type { DashboardResponse } from "../types/dashboard.type"


export const getDashboardStats = async(): Promise<DashboardResponse>=>{
     const response  = await api.get('/api/dashboard/stats')

     return response.data
}