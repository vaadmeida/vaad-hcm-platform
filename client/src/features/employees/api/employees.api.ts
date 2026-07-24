import { api } from "@/lib"
import type { EmployeeListResponse } from "../types/employee.types"


export const getEmployees = async (): Promise<EmployeeListResponse> => {
    
    try {
        const response = await api.get('/api/employees')

        return response.data

    } catch (error) {
        console.error("Employee List API Error:", error);
        throw error;
    }
}