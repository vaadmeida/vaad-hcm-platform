import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "../api/employees.api";
import type { UpdateEmployeeDTO } from "../types/employee.types";

export const useUpdateEmployee = () => {

      const queryClient = useQueryClient();

     return useMutation({
           mutationFn:({ employeeId, payload }: { employeeId: string; payload: Partial<UpdateEmployeeDTO> }) => updateEmployee(employeeId, payload),
           onSuccess: () => {
             queryClient.invalidateQueries({
               queryKey: ["employees"],
             });
           }
        })

}