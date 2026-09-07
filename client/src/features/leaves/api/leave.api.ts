import { api } from "@/lib";
import type { ApproveOrRejectLeaveRequestPayload, ApproveOrRejectLeaveRequestResponse, CreateLeaveTypePayload, CreateLeaveTypeResponse, EmployeeLeaveBalanceResponse, LeaveApiError, LeaveBalanceFilters, LeaveBalanceItem, LeaveBalanceResponse, LeaveRequestDetailsResponse, LeaveRequestFilters, LeaveRequestResponse, LeaveStatsResponse, LeaveTypesResponse, RecentLeaveRequestsResponse, SubmitLeaveRequestResponse, SubmitLeaveRequestType } from "../types/leave.types";
import axios from "axios";

export const getLeaveStats = async (): Promise<LeaveStatsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await api.get<LeaveStatsResponse>("/api/leaves/stats");

    return response.data;

  } catch (error) {
    console.error("Leave Stats API Error:", error);
    throw error;
  }
};

export const getCurrentlyOnLeave = async (): Promise<RecentLeaveRequestsResponse> => {
  try {
    const response = await api.get<RecentLeaveRequestsResponse>('/api/leaves/on-leave')
    return response.data;
  } catch (error) {
    console.error("Getting currently on leave API Error:", error);
    throw error;
  }
}
export const getRecentLeavesRequests = async (): Promise<RecentLeaveRequestsResponse> => {
  try {
    const response = await api.get<RecentLeaveRequestsResponse>('/api/leaves/recent')
    return response.data;
  } catch (error) {
    console.error("Getting recent leaves API Error:", error);
    throw error;
  }
}

export const getLeaveRequests = async (filters?: LeaveRequestFilters): Promise<LeaveRequestResponse> => {
  try {
    const response = await api.get<LeaveRequestResponse>(
      "/api/leaves/request", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Getting leave requests API Error:", error);
    throw error;
  }
};



export const getAllLeaveBalance = async (filters?: LeaveBalanceFilters): Promise<LeaveBalanceItem[]> => {
  try {
    const response = await api.get<LeaveBalanceResponse>("/api/leaves/balance/all",
      {
        params: filters,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Getting leave balances API Error:", error);
    throw error;
  }
};

export const getTeamLeaveBalance = async (
  filters?: LeaveBalanceFilters
): Promise<LeaveBalanceItem[]> => {
  try {
    const response = await api.get<LeaveBalanceResponse>(
      "/api/leaves/balance/team",
      {
        params: filters,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Getting team leave balances API Error:", error);
    throw error;
  }
};

export const getEmployeeLeaveBalance = async (
  employeeId: string
): Promise<EmployeeLeaveBalanceResponse> => {
  try {
    const response = await api.get<EmployeeLeaveBalanceResponse>(
      `/api/leaves/balance/${employeeId}`
    );

    return response.data;
  } catch (error) {
    console.error("Getting employee leave balance API Error:", error);
    throw error;
  }
};
export const getLeaveTypes = async (): Promise<LeaveTypesResponse> => {
  try {
    const response = await api.get<LeaveTypesResponse>("/api/leaves");
    return response.data;
  } catch (error) {
    console.error("Getting leave types API Error:", error);
    throw error;
  }
};


export const createLeaveType = async (payload: CreateLeaveTypePayload): Promise<CreateLeaveTypeResponse> => {
  try {
    const response = await api.post<CreateLeaveTypeResponse>("/api/leaves", payload);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("CREATE LEAVE TYPE ERROR STATUS:", error.response?.status);
      console.log("CREATE LEAVE TYPE ERROR DATA:", error.response?.data);
    }

    console.error("Creating leave type API Error:", error);
    console.error("Creating leave type API Error:", error);
    throw error;
  }
};
export const getMyLeaveBalance = async (): Promise<EmployeeLeaveBalanceResponse> => {
  try {
    const response = await api.get<EmployeeLeaveBalanceResponse>(
      "/api/leaves/balance"
    );

    return response.data;
  } catch (error) {
    console.error("Getting my leave balance API Error:", error);
    throw error;
  }
};

export const submitLeaveRequest = async (data: SubmitLeaveRequestType): Promise<SubmitLeaveRequestResponse> => {
  try {
    const response = await api.post<SubmitLeaveRequestResponse>("/api/leaves/request", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<LeaveApiError>(error)) {
      console.log("SUBMIT LEAVE ERROR STATUS:", error.response?.status);
      console.log("SUBMIT LEAVE ERROR DATA:", error.response?.data);

      console.log(
        "SUBMIT LEAVE VALIDATION DETAIL:",
        JSON.stringify(error.response?.data?.detail, null, 2)
      );
    }

    throw error;
  }
}

export const getLeaveRequestById = async (id: string): Promise<LeaveRequestDetailsResponse> => {
  try {
    const response = await api.get(`api/leaves/request/${id}`);

    return response.data;
  } catch (error) {

    console.error("Employee Getting Leave Request By ID API Error:", error);

    throw error;
  }
};

export const approveOrRejectLeaveRequest = async (id: string,
  payload: ApproveOrRejectLeaveRequestPayload
): Promise<ApproveOrRejectLeaveRequestResponse> => {

  try {
    const response = await api.patch(`api/leaves/${id}`, payload);

    return response.data;
  } catch (error) {
    console.error("Approve or Reject Leave Request API Error:", error);

    throw error;
  }

};