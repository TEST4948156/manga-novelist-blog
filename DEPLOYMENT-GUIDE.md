# 🚀 部署指南

## 方式一：Vercel 部署（推荐）

### 前提条件
1. 安装 Node.js (版本 18+)
2. 注册 [Vercel](https://vercel.com) 账号
3. 安装 Vercel CLI: `npm install -g vercel`

### 快速部署

#### 方法1: 使用部署脚本
```bash
# 运行部署脚本
./deploy.bat
```

#### 方法2: 手动部署
```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 登录 Vercel
npx vercel login

# 4. 部署
npx vercel --prod
```

### 配置说明

#### 1. vercel.json 配置
项目已包含 `vercel.json` 配置文件，支持：
- 静态文件托管
- Serverless API 函数
- 路由重写

#### 2. API 路由
- `/api/stats` - 获取统计信息
- `/api/works` - 作品列表和创建
- `/api/works/[id]` - 单个作品操作
- `/api/works/[id]/like` - 点赞功能

#### 3. 环境变量
Vercel 会自动设置生产环境变量，无需额外配置。

### 部署后验证
1. 访问部署的 URL
2. 测试登录功能（admin/admin123）
3. 测试作品的增删改查
4. 验证统计数据更新

## 方式二：Netlify 部署

### 步骤
1. 构建项目：`npm run build`
2. 将 `dist` 文件夹上传到 Netlify
3. 配置重定向规则（需要后端API支持）

### 注意事项
- Netlify 主要适合静态网站
- 需要单独部署后端API
- 推荐使用 Vercel 获得完整功能

## 方式三：自定义服务器部署

### 使用 Express 服务器
```bash
# 1. 构建前端
npm run build

# 2. 启动后端服务器
cd server
npm start
```

### 配置 Nginx（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 环境变量配置

### 开发环境
创建 `.env.local` 文件：
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### 生产环境
- **Vercel**: 自动配置为 `/api`
- **其他平台**: 设置 `VITE_API_BASE_URL` 为你的API地址

## 数据持久化

### Vercel 部署注意事项
- 使用 `/tmp` 目录存储数据
- 数据在函数重启时会丢失
- 建议集成数据库（如 MongoDB、PostgreSQL）

### 数据库集成建议
1. **MongoDB Atlas**（免费层）
2. **Supabase**（PostgreSQL）
3. **PlanetScale**（MySQL）
4. **Vercel KV**（Redis）

## 域名配置

### Vercel 自定义域名
1. 在 Vercel 控制台添加域名
2. 配置 DNS 记录
3. 自动获得 SSL 证书

## 监控和日志

### Vercel 功能
- 自动错误监控
- 性能分析
- 访问日志
- 函数执行统计

## 常见问题

### Q: API 请求失败
A: 检查 CORS 配置和 API 路径

### Q: 数据丢失
A: Vercel 的 `/tmp` 存储是临时的，需要持久化数据库

### Q: 构建失败
A: 检查 Node.js 版本和依赖安装

### Q: 登录状态丢失
A: 检查 localStorage 和浏览器设置

## 性能优化

### 前端优化
- 启用 Gzip 压缩
- 图片懒加载
- 代码分割
- CDN 加速

### API 优化
- 响应缓存
- 数据库索引
- 连接池
- 限流控制

## 安全建议

### 生产环境
1. 更改默认管理员密码
2. 实现 JWT 认证
3. 添加 HTTPS
4. 配置 CSP 头
5. 输入验证和过滤

## 备份策略

### 数据备份
1. 定期导出数据
2. 版本控制
3. 异地备份
4. 自动化脚本

## 更新部署

### 自动部署
- 连接 GitHub 仓库
- 推送代码自动部署
- 分支保护规则

### 手动更新
```bash
# 更新代码
git pull origin main

# 重新部署
npx vercel --prod
```
