import { NextFunction, Request, Response } from "express";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};


export const requireRoles = (...roles: string[]) => {

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission for this action",
      });
    }

    next();
  };
  
};