import { Request, Response, NextFunction } from 'express';
import { log } from './logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 记录错误日志
  log.error('Error occurred:', err);

  // 判断是否为自定义错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // 未知错误，返回通用错误信息
  return res.status(500).json({
    error: '服务器内部错误',
    statusCode: 500,
  });
};

