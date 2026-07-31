import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.ts";

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: "admin" | "manager" | "employee" | "hr";
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };

        const employee = await prisma.employee.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
            },
        });

        if (!employee || employee.status === "inactive") {
            return res.status(401).json({ error: "Invalid user" });
        }

        req.user = {
            id: employee.id,
            email: employee.email,
            role: employee.role as "admin" | "manager" | "employee" | "hr",
        };

        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};