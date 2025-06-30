# 🚀 快速 Netlify 部署指南

## 📋 准备工作已完成 ✅

我已经为您完成了所有技术准备工作：
- ✅ 转换 Node.js 后端为 Netlify Functions
- ✅ 配置 netlify.toml 文件
- ✅ 设置 API 路由重定向
- ✅ 创建部署和测试工具

## 🎯 您需要做的 3 个步骤

### 步骤 1: 设置 Git 仓库
```bash
# 运行 Git 设置脚本
.\setup-git.bat
```

### 步骤 2: 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名称：`manga-novelist-website`
3. 设为公开（Public）
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

### 步骤 3: 推送代码到 GitHub
```bash
# 替换为您的 GitHub 用户名
git remote add origin https://github.com/您的用户名/manga-novelist-website.git
git branch -M main
git push -u origin main
```

## 🌐 部署到 Netlify

### 方法一：通过 GitHub 连接（推荐）
1. 访问 [netlify.com](https://netlify.com)
2. 点击 "Sign up" 或 "Log in"
3. 选择 "GitHub" 登录
4. 点击 "New site from Git"
5. 选择 "GitHub"
6. 找到并选择 `manga-novelist-website` 仓库
7. 构建设置会自动检测：
   - Build command: `npm run build`
   - Publish directory: `dist`
8. 点击 "Deploy site"

### 方法二：拖拽部署
1. 运行 `.\deploy-netlify.bat` 构建项目
2. 将整个项目文件夹拖拽到 Netlify 控制台

## ⚙️ 重要：设置环境变量

部署完成后，必须设置环境变量：

1. 在 Netlify 控制台，进入您的站点
2. 点击 "Site settings"
3. 点击 "Environment variables"
4. 点击 "Add variable"
5. 添加：
   - Key: `DEEPSEEK_API_KEY`
   - Value: `sk-5608f362dd6743a9a9d2880ea0b3c214`
6. 点击 "Save"
7. 重新部署站点（Deploys > Trigger deploy > Deploy site）

## 🧪 测试部署

部署完成后：

1. 访问 Netlify 提供的 URL（如：https://amazing-site-123456.netlify.app）
2. 测试基本功能：
   - 页面是否正常加载
   - 登录功能（admin/admin123）
   - 创建作品功能
   - 点赞功能
3. 上传 `test-netlify-functions.html` 到站点进行 API 测试

## 🎉 完成！

恭喜！您的小说家网站现在已经：
- ✅ 全球可访问
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 无服务器后端
- ✅ 免费托管

## 📞 需要帮助？

如果遇到问题：
1. 检查 Netlify 部署日志
2. 确认环境变量设置正确
3. 使用测试工具验证 API 功能
4. 查看浏览器控制台错误信息

## 🔄 后续更新

要更新网站：
1. 修改代码
2. 提交到 GitHub：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```
3. Netlify 会自动重新部署

---

**提示**：如果您没有 GitHub 账号，也可以直接拖拽文件夹到 Netlify 进行部署，但推荐使用 GitHub 方式以便后续更新。
