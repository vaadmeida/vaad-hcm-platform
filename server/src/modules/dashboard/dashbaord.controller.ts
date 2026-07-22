import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service.ts";
import { AppError } from "../../errors/appError.ts";

export const getDashboardStats = async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    const { role } = req.user;

    let stats;

    switch (role) {
        case "admin":
            stats = await dashboardService.getAdminStats();
            break;

        case "hr":
            stats = await dashboardService.getHRStats();
            break;

        case "manager":
            stats = await dashboardService.getManagerStats(req.user.id);
            break;

        case "employee":
            stats = await dashboardService.getEmployeeStats(req.user.id);
            break;

        default:
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this dashboard.",
            });
    }
    return res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully.",
        data: stats,
    });
};


export const getEmployeesByDepartmentController = async (req: Request, res: Response) => {

    const stats = await dashboardService.getEmployeesByDepartment()

    return res.status(200).json({
        success: true,
        message: "Employees by department retrieved successfully.",
        data: stats,
    });

}

export const getLeaveOverviewController = async (req: Request,res: Response) => {

  if (!req.user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const leaveOverview = await dashboardService.getLeaveOverview(req.user);

  return res.status(200).json({
    success: true,
    message: "Leave status overview retrieved successfully.",
    data: leaveOverview,
  });
  
};