import prisma from "../../config/prisma.ts"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from "../../errors/appError.ts";
import validator from 'validator'

type JwtPayload = {
  id: string;
  email: string;
  role: string;
}

export const loginUser = async (email: string, password: string) => {

  const employee = await prisma.employee.findUnique({
    where: { email },
  });

  if (!employee) {
    throw new AppError(
      "Unauthorized",
      401,
      "AUTH_INVALID_CREDENTIALS"
    )
  }

  const isMatch = await bcrypt.compare(password, employee.password_hash);

  if (!isMatch) {
    throw new AppError(
      "Unauthorized",
      401,
      "AUTH_INVALID_CREDENTIALS"
    )
  }

  if (employee.status === "inactive" || employee.status === "terminated") {
    throw new AppError(
      "Account is inactive",
      403,
      "AUTH_ACCOUNT_DISABLED"
    );

  }

  if (!validator.isEmail(email)) {
    throw new AppError("Invalid email format", 400, "INVALID_EMAIL");
  }

  const payload = {
    id: employee.id,
    email: employee.email,
    role: employee.role,
  };

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "8h",
  });
  return {
  
    data: {
      user: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        first_name: employee.first_name,
        last_name: employee.last_name,
      },
        token
    },
  };
};

export const logoutUser = async () => {
  return { message: "Logged out successfully" };
};

export const refreshAccessToken = async (authHeader: string) => {

  if (!authHeader) {
    throw new AppError(
      "No token provided",
      401,
      "AUTH_NO_TOKEN"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Invalid token format", 401, "AUTH_INVALID_TOKEN_FORMAT");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

  const payload = decoded as JwtPayload;

  const newToken = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "8h" }
  );

  return newToken;
};