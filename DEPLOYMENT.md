# MamiBaby 生产环境部署指南

## 前置要求

1. **安装 PM2**（全局安装）
```bash
npm install -g pm2
# 或
pnpm add -g pm2
```

2. **配置环境变量**
确保生产服务器上有正确的 `.env` 文件：
```bash
# .env
ALICLOUD_API_KEY=your-production-api-key
ALICLOUD_MODEL=qwen-turbo
JWT_SECRET=your-production-jwt-secret-change-this
PORT=3000
NODE_ENV=production
DEFAULT_USERNAME=guest
DEFAULT_PASSWORD=iamguest123
```

## 部署步骤

### 方法一：本地构建 + 上传部署

```bash
# 1. 本地构建
pnpm build

# 2. 上传到服务器（需要上传的文件/文件夹）
# - dist/
# - node_modules/
# - .env
# - ecosystem.config.js
# - package.json

# 3. 在服务器上安装依赖（如果 node_modules 没上传）
cd /path/to/mamibaby
pnpm install --prod

# 4. 使用 PM2 启动
pnpm pm2:start
```

### 方法二：服务器上构建部署

```bash
# 1. 拉取代码
git pull origin main

# 2. 安装依赖
pnpm install

# 3. 构建项目
pnpm build

# 4. 启动服务（首次）
pnpm pm2:start

# 或重新加载（已在运行）
pnpm pm2:reload
```

### 方法三：自动化部署脚本

```bash
# 使用 deploy 脚本（构建 + 重载）
pnpm deploy
```

## PM2 常用命令

### 启动和停止

```bash
# 启动应用
pnpm pm2:start
# 或
pm2 start ecosystem.config.js --env production

# 停止应用
pnpm pm2:stop

# 重启应用（会有短暂停机）
pnpm pm2:restart

# 重新加载应用（0停机时间）
pnpm pm2:reload

# 删除应用
pnpm pm2:delete
```

### 监控和日志

```bash
# 查看应用列表和状态
pm2 list
pm2 ls

# 查看实时日志
pnpm pm2:logs
# 或
pm2 logs mamibaby

# 查看监控面板
pnpm pm2:monit

# 查看详细信息
pm2 show mamibaby

# 清空日志
pm2 flush
```

### 进程管理

```bash
# 查看应用状态
pm2 status

# 保存当前进程列表（开机自启）
pm2 save

# 设置开机自启
pm2 startup

# 删除开机自启
pm2 unstartup
```

## 目录结构（生产环境）

```
mamibaby/
├── dist/                    # 构建产物
│   ├── client/             # 前端静态文件
│   │   ├── index.html
│   │   └── assets/
│   └── server/             # 后端编译后的 JS
│       └── index.js
├── node_modules/           # 依赖包（仅生产依赖）
├── logs/                   # PM2 日志
│   ├── pm2-error.log
│   └── pm2-out.log
├── .env                    # 环境变量
├── ecosystem.config.js     # PM2 配置
└── package.json
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ALICLOUD_API_KEY` | 阿里云 API Key | sk-xxx... |
| `ALICLOUD_MODEL` | 使用的模型 | qwen-turbo |
| `JWT_SECRET` | JWT 签名密钥 | 随机字符串（32位以上） |
| `PORT` | 服务端口 | 3000 |
| `NODE_ENV` | 运行环境 | production |
| `DEFAULT_USERNAME` | 默认用户名 | guest |
| `DEFAULT_PASSWORD` | 默认密码 | iamguest123 |

## 性能优化建议

### 1. 使用 Cluster 模式
在 `ecosystem.config.js` 中设置：
```javascript
instances: 'max',  // 使用所有 CPU 核心
exec_mode: 'cluster'
```

### 2. 启用日志轮转
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 3. 内存限制
在 `ecosystem.config.js` 中已设置：
```javascript
max_memory_restart: '500M'
```

### 4. 配置 Nginx 反向代理（推荐）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/mamibaby/dist/client;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 流式响应支持
        proxy_buffering off;
        proxy_cache off;
    }
}
```

## 故障排查

### 应用无法启动

```bash
# 查看错误日志
pm2 logs mamibaby --err

# 查看详细信息
pm2 show mamibaby

# 手动测试启动
cd /path/to/mamibaby
NODE_ENV=production node dist/server/index.js
```

### 应用频繁重启

```bash
# 查看重启次数
pm2 list

# 检查内存使用
pm2 monit

# 调整内存限制
# 编辑 ecosystem.config.js 中的 max_memory_restart
```

### 日志文件过大

```bash
# 清空日志
pm2 flush

# 手动删除
rm -f logs/*.log

# 安装日志轮转
pm2 install pm2-logrotate
```

## 安全建议

1. **修改默认账号密码**
   - 在 `.env` 中修改 `DEFAULT_USERNAME` 和 `DEFAULT_PASSWORD`

2. **使用强 JWT Secret**
   ```bash
   # 生成随机密钥
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **配置防火墙**
   - 只开放必要的端口（80、443）
   - 限制 3000 端口的外部访问

4. **使用 HTTPS**
   - 配置 SSL 证书
   - 使用 Nginx 反向代理处理 HTTPS

5. **定期更新依赖**
   ```bash
   pnpm update
   pnpm audit
   ```

## 监控和告警

### PM2 Plus（可选）

```bash
# 注册 PM2 Plus 账号
pm2 plus

# 连接应用
pm2 link [secret_key] [public_key]
```

### 自定义监控

可以集成以下工具：
- Prometheus + Grafana
- New Relic
- Datadog

## 备份策略

1. **代码备份**：使用 Git
2. **数据库备份**：定期备份（如果有）
3. **配置备份**：备份 `.env` 文件
4. **日志归档**：定期归档重要日志

## 快速命令参考

```bash
# 构建
pnpm build

# 首次部署
pnpm pm2:start

# 更新部署（0停机）
pnpm deploy

# 查看日志
pnpm pm2:logs

# 查看状态
pm2 list

# 重启
pnpm pm2:restart

# 停止
pnpm pm2:stop
```

## 联系支持

如有问题，请查看：
- 日志文件：`logs/pm2-error.log`
- PM2 文档：https://pm2.keymetrics.io/docs/
- 项目 README：README.md

