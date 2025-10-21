import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import storyRoutes from './routes/story';
import { loggerMiddleware } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 安全头设置
app.use(helmet());

// CORS 配置（仅开发环境）
if (NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
}

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use(loggerMiddleware);

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/story', storyRoutes);

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 生产环境：提供静态文件服务
if (NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));
  
  // 所有其他路由返回 index.html（支持前端路由）
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  if (NODE_ENV === 'development') {
    console.log(`🌐 Frontend: http://localhost:3001`);
  }
});

