import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateDepartmentDto } from "../types/departments.types";
import { updateDepartment } from "../api/department.api";

export const useUpdateDepartment = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ departmentId, payload }: { departmentId: string; payload: Partial<UpdateDepartmentDto> }) => updateDepartment(departmentId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            queryClient.invalidateQueries({
                queryKey: ["departments", variables.departmentId],
            });
        },
    })
}