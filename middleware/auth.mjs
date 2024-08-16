// middleware/auth.mjs
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors.mjs';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    throw new AppError('Unauthorized 1', 401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Unauthorized 2', 401);
  }
};
