import { Request, Response } from 'express';
import { loginUser, refreshAccessToken, } from './auth.services.ts';
import { AppError } from '../../errors/appError.ts';

type LoginRequestBody = {
  email: string;
  password: string;
};

export const loginUserController = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {

  try {
    const { email, password } = req.body;

    const {  data } = await loginUser(email, password);

    res.status(200).json({
      "status": "200",
      success: "true",
      data
    });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({
        status: error.status,
        code: error.code,
        message: error.message,
        detail: error.detail || null,
      });
    }

    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: "Internal server error",
      detail: null,
    });
  }

}

export const logOutController = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshAccessTokenController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    const newToken = await refreshAccessToken(authHeader!);

    res.json({ accessToken: newToken });

  } catch (error) {
    res.status(403).json({
        status: 403,
      code: "SERVER_ERROR",
      message: "Internal server error",
      detail: null,
    });
  }
};