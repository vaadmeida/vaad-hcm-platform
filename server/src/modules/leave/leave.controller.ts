import { Request, Response } from "express"
import { approveOrRejectParamsSchema, approveOrRejectSchema, cancelLeaveRequestParamsSchema, CreateLeaveTypeSchema, getLeaveBalanceParamsSchema, getLeaveRequestSchema, getLeaveSchema, submitRequestSchema } from "./leave.validator.ts"
import { AppError } from "../../errors/appError.ts";
import { approveOrRejectRequest, cancelRequest, createLeaveTypes, getAllLeaveTypes, getLeaveRequests, getLeaveTypes, getMyLeaveBalance, submitLeaveRequests } from "./leave.service.ts";
import z from "zod";


export const createLeaveTypesController = async (req: Request, res: Response) => {

    const parsed = CreateLeaveTypeSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsed.error)
        );
    }

    if (!req.user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const result = await createLeaveTypes({
        ...parsed.data,
        user: {
            id: req.user.id,
            role: req.user.role as "admin" | "manager" | "employee",
        },
    });

    return res.status(201).json({
        success: true,
        message: "Leave created successfully",
        data: result
    });

}

export const getLeaveTypesController = async (req: Request, res: Response) => {

    const parsed = getLeaveSchema.safeParse(req.params)

    if (!parsed.success) throw new AppError("Invalid Leave ID", 400, "VALIDATION_ERROR");


    const user = req.user;

    if (!user) {
        throw new AppError("Unauthorized", 401, "NO_USER");
    }

    const result = await getLeaveTypes(parsed.data.id, user)

    return res.status(200).json({
        success: true,
        data: result,
    });

}

export const getAllLeaveTypesController = async (req: Request, res: Response) => {

    const leaveTypes = await getAllLeaveTypes();

    return res.status(200).json({
        success: true,
        count: leaveTypes.length,
        data: leaveTypes,
    });
}

export const getMyLeaveBalanceController = async (
    req: Request,
    res: Response
) => {

    const parsed = getLeaveBalanceParamsSchema.safeParse(req.params);

    if (!parsed.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsed.error)
        );
    }

    if (!req.user) {
        throw new AppError(
            "Unauthorized",
            401,
            "UNAUTHORIZED"
        );
    }

    const loggedInUserId = req.user.id;
    const targetEmployeeId = parsed.data.id

    const result = await getMyLeaveBalance(
        loggedInUserId,
        targetEmployeeId
    );

    return res.status(200).json({
        success: true,
        data: result,
    });
};
export const getLeaveRequestsController = async (req: Request, res: Response) => {

    const parsed = getLeaveRequestSchema.safeParse(req.query);

    if (!parsed.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsed.error)
        );
    }

    if (!req.user) {
        throw new AppError(
            "Unauthorized",
            401,
            "UNAUTHORIZED"
        );
    }

    const result = await getLeaveRequests({
        user: {
            id: req.user.id,
            role: req.user.role as "admin" | "manager" | "employee",
        },
        ...parsed.data,
    });

    return res.status(200).json({
        success: true,
        data: result,
    });

};
export const submitLeaveRequestsController = async (req: Request, res: Response) => {

    const parsed = submitRequestSchema.safeParse(req.body)

    if (!parsed.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsed.error)
        );
    }

    if (!req.user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }


    const result = await submitLeaveRequests(req.user.id, parsed.data);


    return res.status(201).json({
        success: true,
        message: "Leave Request Submited Successfully",
        data: result
    });
}

export const approveOrRejectRequestController = async (
    req: Request,
    res: Response
) => {

    const parsedParams = approveOrRejectParamsSchema.safeParse(req.params);

    if (!parsedParams.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsedParams.error)
        );
    }

    const parsedBody = approveOrRejectSchema.safeParse(req.body);

    if (!parsedBody.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsedBody.error)
        );
    }

    const requestId = parsedParams.data.id;

    const { action } = parsedBody.data;

    if (!req.user) {
        throw new AppError(
            "Unauthorized",
            401,
            "UNAUTHORIZED"
        );
    }
    const role = req.user.role
    const managerId = req.user.id;

    await approveOrRejectRequest(
        action,
        requestId,
        role,
        managerId,
        action === "REJECT"
            ? parsedBody.data.rejectionReason
            : undefined
    );

    return res.status(200).json({
        success: true,
        message:
            action === "APPROVE"
                ? "Leave request approved successfully."
                : "Leave request rejected successfully.",
    });
};

export const cancelRequestController = async (req: Request, res: Response) => {

    const parsedParams = cancelLeaveRequestParamsSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            z.treeifyError(parsedParams.error)
        );
    }

    const requestId = parsedParams.data.id;
    const employeeId = req.user!.id;

    const result = await cancelRequest(requestId, employeeId);

    return res.status(200).json({
        success: true,
        message: "Leave request cancelled successfully.",
        data: result
    });
}

