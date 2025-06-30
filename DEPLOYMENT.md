# 🚀 外部访问部署指南

## 快速部署方案

### 方案一：Vercel + Railway（推荐，免费）

#### 步骤1：部署后端到Railway
1. 访问 [railway.app](https://railway.app)
2. 用GitHub登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库，设置根目录为 `server`
5. 等待自动部署完成
6. 复制Railway提供的URL

#### 步骤2：部署前端到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 用GitHub登录
3. 导入你的仓库
4. 在环境变量中设置：
   - `VITE_API_BASE_URL` = `https://你的railway域名.railway.app/api`
5. 点击Deploy

### 方案二：Netlify + Render

#### 后端部署到Render
1. 访问 [render.com](https://render.com)
2. 创建Web Service
3. 连接GitHub仓库，根目录设为 `server`
4. 设置：
   - 构建命令：`npm install`
   - 启动命令：`npm start`

#### 前端部署到Netlify
1. 访问 [netlify.com](https://netlify.com)
2. 连接GitHub仓库
3. 构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`dist`

## 🔧 部署前准备

### 1. 更新package.json构建脚本
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 2. 确保环境变量配置
前端会自动检测API地址，支持：
- 开发环境：`http://localhost:3001/api`
- 生产环境：通过 `VITE_API_BASE_URL` 设置

## 📱 部署后测试

1. 访问前端网站
2. 检查服务器连接状态（页面顶部）
3. 测试创建文章功能
4. 测试文件上传功能
5. 测试点赞功能

## 🌐 获取访问链接

部署完成后你将获得：
- **前端网站**：`https://你的项目名.vercel.app`
- **后端API**：`https://你的项目名.railway.app`

## 💡 部署提示

1. **免费额度**：Vercel和Railway都有免费额度，足够个人使用
2. **自动部署**：连接GitHub后，每次推送代码都会自动部署
3. **HTTPS**：部署后自动支持HTTPS访问
4. **全球CDN**：Vercel提供全球CDN加速

## 🔄 更新网站

1. 修改代码并推送到GitHub
2. 平台自动检测并重新部署
3. 几分钟后更新生效

## 📞 需要帮助？

如果部署过程中遇到问题：
1. 检查构建日志
2. 确认环境变量设置
3. 验证API连接状态
4. 查看浏览器控制台错误
