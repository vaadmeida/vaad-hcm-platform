import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../errors/appError.ts";

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error("========== ERROR ==========");
  console.error("Route:", req.method, req.originalUrl);
  console.error("Name:", error?.name);
  console.error("Message:", error?.message);
  console.error("Stack:", error?.stack);
  console.error("Full Error:", error);
  console.error("===========================");

  if (error instanceof AppError) {
    return res.status(error.status).json({
      success: false,
      status: error.status,
      code: error.code,
      message: error.message,
      detail: error.detail || null,
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    code: "SERVER_ERROR",
    message: "Internal server error",
    detail: null,
  });
};