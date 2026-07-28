import { api } from "@/lib"
import type { CreateEmployeePayload, CreateEmployeeResponse, Employee, EmployeeFilters, EmployeeListResponse, EmployeeResponse } from "../types/employee.types"


export const getEmployees = async (filters: EmployeeFilters): Promise<EmployeeListResponse> => {

    try {
        const { data } = await api.get<EmployeeListResponse>('/api/employees', {
            params: filters
        })

        return data

    } catch (error) {
        console.error("Employee List API Error:", error);
        throw error;
    }
}

export const createEmployee = async (payload: CreateEmployeePayload): Promise<CreateEmployeeResponse> => {

    try {
        const response = await api.post<CreateEmployeeResponse>("/api/employees", payload);

        return response.data;
    } catch (error) {
        console.error("Create Employee API Error:", error);
        throw error;
    }

}
export const getEmployeeById = async (employeeId: string): Promise<Employee> => {

    try {
        const response = await api.get<EmployeeResponse>(`/api/employees/${employeeId}`);

        return response.data.data;

    } catch (error) {
        console.error("Getting Employee API Error:", error);
        throw error;
    }

}