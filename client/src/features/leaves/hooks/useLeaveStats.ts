import { useQuery } from "@tanstack/react-query"
import { getLeaveStats } from "../api/leave.api"

export const useLeaveStats = () =>{
   
    return useQuery({
        queryKey: ['leaves'],
        queryFn: getLeaveStats,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

}