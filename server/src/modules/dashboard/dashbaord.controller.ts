import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service.ts";

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