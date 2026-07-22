import { useQuery } from "@tanstack/react-query"
import type {  LeaveOverviewResponse } from "../types/dashboard.type"
import { getLeaveOverview } from "../api/dashboard.api"


export const useLeaveOverview=()=>{
    return useQuery<LeaveOverviewResponse>({
        queryKey:["leave-overview"],
        queryFn: getLeaveOverview,
        staleTime: 1000 * 60 * 5
    })
}