# 🚀 快速部署指南

## 立即部署到 Vercel

### 方法1: 一键部署（推荐）

点击下面的按钮直接部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/manga-novelist-website)

### 方法2: 手动部署

#### 步骤1: 准备项目
```bash
# 确保在项目根目录
cd manga-novelist-website

# 安装依赖
npm install

# 构建项目
npm run build
```

#### 步骤2: 部署到 Vercel
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel --prod
```

#### 步骤3: 配置完成
- Vercel 会自动检测项目类型
- 自动配置 API 路由
- 生成部署 URL

## 其他部署选项

### Netlify 部署
1. 构建项目：`npm run build`
2. 上传 `dist` 文件夹到 Netlify
3. 注意：需要单独部署后端 API

### GitHub Pages
1. 构建项目：`npm run build`
2. 推送 `dist` 文件夹到 `gh-pages` 分支
3. 注意：仅支持静态文件，需要外部 API

## 验证部署

### 功能检查清单
- [ ] 网站可以正常访问
- [ ] 统计数据显示正确
- [ ] 登录功能正常（admin/admin123）
- [ ] 可以新增作品（管理员）
- [ ] 可以点赞作品
- [ ] 可以查看作品详情
- [ ] 响应式设计正常

### API 端点测试
- `GET /api/stats` - 统计信息
- `GET /api/works` - 作品列表
- `POST /api/works` - 创建作品
- `POST /api/works/[id]/like` - 点赞

## 环境配置

### 生产环境变量
Vercel 会自动设置：
- `NODE_ENV=production`
- `VITE_API_BASE_URL=/api`

### 自定义配置
如需自定义，在 Vercel 控制台设置环境变量。

## 域名配置

### 使用 Vercel 域名
部署后会获得类似 `your-app.vercel.app` 的域名

### 自定义域名
1. 在 Vercel 控制台添加域名
2. 配置 DNS 记录
3. 自动获得 SSL 证书

## 数据说明

### 当前存储方式
- 使用 Vercel 的 `/tmp` 目录
- 数据在函数重启时会重置
- 适合演示和测试

### 生产环境建议
集成持久化数据库：
- MongoDB Atlas（推荐）
- Supabase
- PlanetScale
- Vercel KV

## 安全提醒

### 默认账号
- 用户名：`admin`
- 密码：`admin123`

### 生产环境建议
1. 修改默认密码
2. 实现更安全的认证
3. 添加输入验证
4. 配置 HTTPS

## 故障排除

### 常见问题
1. **构建失败**：检查 Node.js 版本（需要 18+）
2. **API 错误**：检查 CORS 配置
3. **登录失败**：清除浏览器缓存
4. **数据丢失**：正常现象，使用临时存储

### 获取帮助
- 查看 Vercel 部署日志
- 检查浏览器控制台
- 参考完整部署指南

## 下一步

### 功能扩展
- 添加用户注册
- 实现文件上传
- 添加评论系统
- 集成搜索功能

### 性能优化
- 启用缓存
- 图片优化
- 代码分割
- CDN 配置

---

🎉 **恭喜！你的博客网站已经可以部署了！**

需要帮助？查看 `DEPLOYMENT-GUIDE.md` 获取详细说明。
