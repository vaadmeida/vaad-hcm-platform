import { useQuery } from "@tanstack/react-query"
import type { EmployeeChartResponse } from "../types/dashboard.type"
import { getEmployeeByDepartment } from "../api/dashboard.api"


export const useEmployeesByDepartment=()=>{
    return useQuery<EmployeeChartResponse>({
        queryKey:["employees-by-departments"],
        queryFn: getEmployeeByDepartment,
        staleTime: 1000 * 60 * 5
    })
}