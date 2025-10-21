import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import dotenv from 'dotenv';

// 确保环境变量已加载
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
}

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// 生成 JWT Token
export const generateToken = (username: string): string => {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '7d' } // Token 有效期 7 天
  );
};

// 验证 JWT Token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new AppError('Token 无效或已过期', 401);
  }
};

// 认证中间件
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头获取 Token
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('未提供认证 Token', 401);
    }

    // 解析 Token（格式：Bearer <token>）
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('Token 格式错误', 401);
    }

    const token = parts[1];
    
    // 验证 Token
    const payload = verifyToken(token);
    
    // 将用户信息附加到请求对象
    req.user = payload;
    
    next();
  } catch (error) {
    next(error);
  }
};

