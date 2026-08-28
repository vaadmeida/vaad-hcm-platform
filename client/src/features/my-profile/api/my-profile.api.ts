import type { Employee, EmployeeResponse } from "@/features/employees/types/employee.types";
import { api } from "@/lib";


export const getMyProfile = async (): Promise<Employee> => {

    try {
        const response = await api.get<EmployeeResponse>("api/employees/me");

        return response.data.data;
    } catch (error) {
        console.error("My Profile API Error:", error);
        throw error;
    }

};