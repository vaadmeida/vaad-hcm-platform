import { useQuery } from "@tanstack/react-query"
import { getEmployees } from "../api/employees.api"

export const useEmployee= ()=> { 
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
     staleTime: 1000 * 60 * 5
  })
}