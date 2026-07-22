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
export interface EmployeesChart {
    department: string;
    employees: number;
}

export interface EmployeeChartResponse {
    success: boolean;
    message: string;
    data: EmployeesChart[];
}
export interface LeaveOverview {
    leaveStatus: string;
    count: number;
}

export interface LeaveOverviewResponse {
    success: boolean;
    message: string;
    data: LeaveOverview[];
}