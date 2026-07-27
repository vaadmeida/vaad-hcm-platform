import { api } from "@/lib"
import type { CreateEmployeePayload, EmployeeListResponse } from "../types/employee.types"


export const getEmployees = async (): Promise<EmployeeListResponse> => {

    try {
        const response = await api.get('/api/employees')

        return response.data

    } catch (error) {
        console.error("Employee List API Error:", error);
        throw error;
    }
}

export const createEmployee = async (payload: CreateEmployeePayload) => {

    try {
        const response = await api.post("/api/employees", payload);
        return response.data;
    } catch (error) {
        console.error("Create Employee API Error:", error);
        throw error;
    }

}