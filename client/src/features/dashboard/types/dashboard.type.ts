export interface DashboardStats {
    totalEmployees: number,
    totalDepartments: number,
    activeEmployees: number,
    pendingLeaveRequests: number
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardStats;
}