import { api } from "@/lib"
import type { ApiResponse, CreateEmployeePayload, CreateEmployeeResponse, Employee, EmployeeFilters, EmployeeListResponse, EmployeeResponse, Manager, UpdateEmployeeDTO } from "../types/employee.types"
import axios from "axios"


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

export const updateEmployee = async (employeeId: string, payload: Partial<UpdateEmployeeDTO>): Promise<Employee> => {

    try {
        const response = await api.patch<EmployeeResponse>(`/api/employees/${employeeId}`, payload);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("STATUS:", error.response?.status);
            console.log(
                "VALIDATION ERRORS:",
                JSON.stringify(
                    error.response?.data?.errors,
                    null,
                    2
                )
            );
        }

        throw error;
    }
}

export const getManagers = async (): Promise<Manager[]> => {
    const response = await api.get<ApiResponse<Manager[]>>(
        "/api/employees/managers"
    );

    return response.data.data;
};

export const deactivateEmployee = async (employeeId: string): Promise<EmployeeResponse> => {
    try {

        const { data } = await api.patch<EmployeeResponse>(
            `/api/employees/${employeeId}/deactivate`
            );

        return data;

    } catch (error) {
        console.error("Deactivate Employee API Error:", error);
        throw error;
    }
};

export const terminateEmployee = async (employeeId: string): Promise<EmployeeResponse> => {
    
    try {
        const { data } = await api.patch<EmployeeResponse>(
            `/api/employees/${employeeId}/terminate`
        );

        return data;
    } catch (error) {
        console.error("Terminate Employee API Error:", error);
        throw error;
    }
};