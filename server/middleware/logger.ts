import morgan from 'morgan';
import { Request } from 'express';

// HTTP 请求日志格式
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';

export const loggerMiddleware = morgan(morganFormat, {
  skip: (req: Request) => {
    // 跳过健康检查请求的日志
    return req.url === '/api/health';
  },
});

// 自定义日志函数
export const log = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
};

