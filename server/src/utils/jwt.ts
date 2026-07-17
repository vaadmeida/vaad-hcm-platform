import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: object) => {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};
export const generateRefreshToken = (user: object) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};