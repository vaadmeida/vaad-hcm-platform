import { useQuery } from "@tanstack/react-query"
import { getEmployeeById } from "../api/employees.api"

export const useEmployeeDetails= (employeeId? : string)=> { 
  return useQuery({
    queryKey: ['employees', employeeId],
    queryFn: () => getEmployeeById(employeeId!),
    enabled: !!employeeId
  })
}