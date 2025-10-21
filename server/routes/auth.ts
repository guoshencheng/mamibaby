import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import dotenv from 'dotenv';

// 确保环境变量已加载
dotenv.config();

const router = Router();

const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME || 'guest';
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'iamguest123';

// 登录接口
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('用户名不能为空'),
    body('password').trim().notEmpty().withMessage('密码不能为空'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 验证请求参数
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('请求参数错误', 400);
      }

      const { username, password } = req.body;

      // 验证账号密码
      if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
        throw new AppError('用户名或密码错误', 401);
      }

      // 生成 Token
      const token = generateToken(username);

      res.json({
        success: true,
        token,
        user: {
          username,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// 验证 Token 接口（可选）
router.get('/verify', async (_req: Request, res: Response) => {
  // 这个路由可以用于前端验证 Token 是否有效
  res.json({ valid: true });
});

export default router;

