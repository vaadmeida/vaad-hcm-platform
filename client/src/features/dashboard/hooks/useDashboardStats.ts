import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "../api/dashboard.api"
import type { DashboardResponse } from "../types/dashboard.type"

export const useDashboardStats=()=>{
    return useQuery<DashboardResponse>({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
    })
}