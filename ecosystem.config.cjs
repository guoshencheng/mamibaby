module.exports = {
  apps: [
    {
      name: 'mamibaby',
      script: './dist/server/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      // 日志配置
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启配置
      max_memory_restart: '500M',
      
      // 监听文件变化（生产环境建议关闭）
      watch: false,
      
      // 忽略的文件夹
      ignore_watch: ['node_modules', 'logs', 'dist/client'],
      
      // 进程异常自动重启
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 优雅关闭
      kill_timeout: 5000,
    }
  ],

  // 部署配置（可选）
  deploy: {
    production: {
      user: 'your-username',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'your-git-repo',
      path: '/var/www/mamibaby',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production'
    }
  }
};

