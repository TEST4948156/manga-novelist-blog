# 🚀 Netlify 全栈部署指南

## 📋 概述
本指南将帮您将Vue3前端和Node.js后端完全部署到Netlify上，使用Netlify Functions作为后端服务。

## 🔧 部署前准备

### 1. 确保项目结构正确
```
manga-novelist-website/
├── netlify/
│   └── functions/          # Netlify Functions (后端API)
│       ├── works.js        # 作品管理API
│       ├── stats.js        # 统计API
│       ├── activities.js   # 活动记录API
│       ├── ai-continue.js  # AI续写API
│       ├── ai-evaluation.js # AI评价点赞API
│       └── ai-service.js   # AI服务模块
├── src/                    # Vue3前端代码
├── dist/                   # 构建输出目录
├── netlify.toml           # Netlify配置文件
└── package.json
```

### 2. 检查netlify.toml配置
确保配置文件包含以下内容：
```toml
[build]
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  DEEPSEEK_API_KEY = "sk-5608f362dd6743a9a9d2880ea0b3c214"
```

## 🌐 部署步骤

### 方法一：通过Netlify网站部署（推荐）

1. **准备代码**
   ```bash
   # 确保所有更改已提交到Git
   git add .
   git commit -m "准备Netlify部署"
   git push origin main
   ```

2. **连接到Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 使用GitHub账号登录
   - 点击 "New site from Git"
   - 选择您的GitHub仓库

3. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **设置环境变量**
   在Netlify控制台的 Site settings > Environment variables 中添加：
   - `DEEPSEEK_API_KEY`: `sk-5608f362dd6743a9a9d2880ea0b3c214`

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

### 方法二：使用Netlify CLI

1. **安装Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录Netlify**
   ```bash
   netlify login
   ```

3. **初始化项目**
   ```bash
   netlify init
   ```

4. **部署**
   ```bash
   # 构建项目
   npm run build
   
   # 部署到Netlify
   netlify deploy --prod
   ```

## 🔍 验证部署

### 1. 检查前端
- 访问Netlify提供的URL
- 确认页面正常加载
- 检查控制台是否有错误

### 2. 测试API功能
- 测试统计API: `https://your-site.netlify.app/api/stats`
- 测试作品列表: `https://your-site.netlify.app/api/works`
- 测试活动记录: `https://your-site.netlify.app/api/activities`

### 3. 功能测试
- 登录功能（admin/admin123）
- 创建新作品
- 点赞功能
- AI续写功能
- 统计数据更新

## 📊 API端点说明

部署后，以下API端点将可用：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/works` | GET | 获取作品列表 |
| `/api/works` | POST | 创建新作品 |
| `/api/works/:id` | GET | 获取单个作品 |
| `/api/works/:id` | PUT | 更新作品 |
| `/api/works/:id` | DELETE | 删除作品 |
| `/api/works/:id/like` | POST | 点赞作品 |
| `/api/works/:id/ai-evaluation/like` | POST | 点赞AI评价 |
| `/api/stats` | GET | 获取统计信息 |
| `/api/activities` | GET | 获取活动记录 |
| `/api/ai/continue` | POST | AI续写 |

## ⚠️ 注意事项

### 1. 数据持久化限制
- Netlify Functions使用 `/tmp` 目录存储数据
- 数据在函数冷启动时可能丢失
- 建议集成外部数据库（如MongoDB Atlas、Supabase）

### 2. 函数执行限制
- 免费版本有执行时间限制（10秒）
- 有并发请求限制
- 大文件上传可能需要特殊处理

### 3. 环境变量
- 确保在Netlify控制台正确设置环境变量
- DeepSeek API密钥必须正确配置

## 🔧 故障排除

### 构建失败
1. 检查package.json中的依赖
2. 确认Node.js版本兼容性
3. 查看Netlify构建日志

### API请求失败
1. 检查函数部署状态
2. 验证环境变量设置
3. 查看函数执行日志

### 数据丢失
1. 这是正常现象（临时存储）
2. 考虑集成持久化数据库
3. 实现数据备份机制

## 🚀 性能优化建议

1. **启用缓存**
   - 在netlify.toml中配置缓存头
   - 使用CDN加速静态资源

2. **函数优化**
   - 减少冷启动时间
   - 优化函数代码
   - 使用连接池

3. **前端优化**
   - 启用Gzip压缩
   - 图片懒加载
   - 代码分割

## 📞 获取帮助

如果遇到问题：
1. 查看Netlify控制台的部署日志
2. 检查函数执行日志
3. 验证环境变量配置
4. 测试本地开发环境

部署成功后，您的网站将通过 `https://your-site-name.netlify.app` 访问！
