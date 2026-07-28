import { useQuery } from "@tanstack/react-query"
import { getEmployees } from "../api/employees.api"
import type { EmployeeFilters } from "../types/employee.types"

export const useEmployee= (filters: EmployeeFilters)=> { 
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => getEmployees(filters),
     staleTime: 1000 * 60 * 5
  })
}