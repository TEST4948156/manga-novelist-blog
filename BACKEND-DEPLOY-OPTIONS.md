# 🚀 后端部署选项

## 方案1: Netlify Functions（推荐）

### 优势
- ✅ 与前端同域名，无CORS问题
- ✅ 完全免费
- ✅ 自动扩容
- ✅ 全球CDN

### 部署步骤
1. 运行 `.\deploy-backend-only.bat`
2. 拖拽 `backend-deploy` 文件夹到 Netlify
3. 设置环境变量 `DEEPSEEK_API_KEY`

### API端点
- `https://your-site.netlify.app/api/works`
- `https://your-site.netlify.app/api/stats`
- `https://your-site.netlify.app/api/activities`

---

## 方案2: Railway（免费额度）

### 优势
- ✅ 传统Node.js服务器
- ✅ 持久化存储
- ✅ 数据库支持

### 部署步骤
1. 访问 https://railway.app
2. 用GitHub登录
3. 选择 `server` 文件夹部署
4. 设置环境变量

### 配置
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 方案3: Render（免费层）

### 优势
- ✅ 免费SSL
- ✅ 自动部署
- ✅ 数据库支持

### 部署步骤
1. 访问 https://render.com
2. 连接GitHub仓库
3. 选择 Web Service
4. 设置根目录为 `server`

---

## 方案4: Vercel Functions

### 优势
- ✅ 与Netlify类似
- ✅ 优秀的性能
- ✅ 免费额度

### 需要转换
需要将Express路由转换为Vercel Functions格式

---

## 方案5: 本地服务器 + ngrok

### 优势
- ✅ 完全控制
- ✅ 实时调试
- ✅ 无限制

### 步骤
1. 启动本地服务器：`cd server && npm start`
2. 安装ngrok：https://ngrok.com
3. 暴露端口：`ngrok http 3001`
4. 获得公网URL

---

## 推荐选择

### 如果您想要：
- **最简单**：方案1 (Netlify Functions)
- **传统服务器**：方案2 (Railway)
- **本地开发**：方案5 (ngrok)

### 数据持久化考虑
- **Netlify Functions**：临时存储，需要外部数据库
- **Railway/Render**：可以持久化文件
- **本地服务器**：完全持久化

## 环境变量设置

所有方案都需要设置：
```
DEEPSEEK_API_KEY=sk-5608f362dd6743a9a9d2880ea0b3c214
PORT=3001 (某些平台需要)
```

## 前端API配置

部署后，需要更新前端的API地址：
```javascript
// src/services/api.ts
const API_BASE_URL = 'https://your-backend-url.com/api'
```
