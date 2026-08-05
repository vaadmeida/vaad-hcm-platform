import { useQuery } from "@tanstack/react-query"
import { getDepartmentById } from "../api/department.api"
import type { Department } from "../types/departments.types"

export const useDepartment = (id: string) => {

     return useQuery<Department>({
           queryKey: ["departments", id],
           queryFn: () => getDepartmentById(id),
     })

}