// middleware/auth.mjs
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors.mjs';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    return next(new AppError('Unauthorized - No token provided', 401));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    // JWT 검증 에러는 handleJWTError 미들웨어에서 처리됩니다.
    next(error);
  }
};