import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin" | "hr" | "manager" | "employee";
        email: string;
      };
    }
  }
}


export {};