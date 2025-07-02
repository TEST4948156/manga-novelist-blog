# Netlify 部署指南

## 🚀 快速部署步骤

### 方法一：通过 GitHub（推荐）

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TEST4948156/manga-novelist-blog.git
   git push -u origin main
   ```

2. **连接 Netlify**
![alt text](image.png)
   - 点击 "New site from Git"
   - 选择 GitHub，授权并选择仓库 `manga-novelist-blog`
   - 构建设置会自动检测到 `netlify.toml`

3. **配置环境变量**
   - 在 Netlify 项目设置中，进入 "Environment variables"
   - 添加：`DEEPSEEK_API_KEY` = `sk-5608f362dd6743a9a9d2880ea0b3c214`

### 方法二：手动部署

1. **拖拽部署**
   - 直接将整个 `manga-novelist-website` 文件夹拖拽到 Netlify 部署页面
   - Netlify 会自动构建和部署

## 📋 部署检查清单

### ✅ 已准备就绪
- [x] 前端构建成功 (`dist/` 目录已生成)
- [x] Netlify Functions 已配置 (`netlify/functions/`)
- [x] 配置文件正确 (`netlify.toml`)
- [x] 环境变量配置 (需要在 Netlify 中设置)

### 🔗 API 端点
部署后的 API 端点将是：
- `https://your-site.netlify.app/api/works`
- `https://your-site.netlify.app/api/stats`
- `https://your-site.netlify.app/api/activities`
- `https://your-site.netlify.app/api/ai-evaluation`
- `https://your-site.netlify.app/api/ai/continue`

### 🔑 环境变量
在 Netlify 中需要设置：
```
DEEPSEEK_API_KEY=sk-5608f362dd6743a9a9d2880ea0b3c214
```

## 🧪 部署后测试

1. 访问网站首页
2. 测试作品上传功能
3. 测试 AI 评价功能
4. 测试 AI 续写功能
5. 测试登录/登出功能
6. 检查统计数据是否正常显示

## 🔧 故障排除

如果遇到问题：
1. 检查 Netlify 构建日志
2. 确认环境变量已正确设置
3. 检查 Functions 日志
4. 确认 API 端点响应正常

## 📱 功能特性

- ✅ 前端：Vue3 + TypeScript + Vite
- ✅ 后端：Netlify Functions
- ✅ AI 功能：DeepSeek API 集成
- ✅ 权限控制：管理员/游客模式
- ✅ 数据持久化：JSON 文件存储
- ✅ 响应式设计：支持移动端
