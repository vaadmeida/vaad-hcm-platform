import { useQuery } from "@tanstack/react-query"
import { getDepartmentById } from "../api/department.api"


export const useDepartmentsDetails= (departmentId? : string)=> { 
  return useQuery({
    queryKey: ['departments', departmentId],
    queryFn: () => getDepartmentById(departmentId!),
    enabled: !!departmentId
  })
}