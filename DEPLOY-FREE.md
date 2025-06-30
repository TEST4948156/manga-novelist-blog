# 🚀 免费部署指南 - 一键部署到Vercel

## 🎯 方案概述

使用Vercel的Serverless Functions，前后端都部署在Vercel上，完全免费！

## 📋 部署步骤

### 第一步：准备Git仓库

1. **初始化Git仓库**（在项目根目录）：
```bash
git init
git add .
git commit -m "初始提交: 文笔部博客项目"
```

2. **在GitHub创建仓库**：
   - 访问 [github.com](https://github.com)
   - 点击 "New repository"
   - 输入仓库名（如：`manga-novelist-blog`）
   - 选择 "Public"
   - 点击 "Create repository"

3. **推送代码**：
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 第二步：部署到Vercel

1. **访问 [vercel.com](https://vercel.com)**
2. **用GitHub账户登录**
3. **点击 "New Project"**
4. **选择你的GitHub仓库**
5. **直接点击 "Deploy"**（无需任何配置）
6. **等待部署完成**

### 第三步：测试功能

部署完成后：
1. **访问你的网站**（Vercel会提供一个URL）
2. **测试创建文章功能**
3. **测试点赞功能**
4. **检查所有功能是否正常**

## ✨ 优势

- **完全免费**：Vercel提供慷慨的免费额度
- **一键部署**：前后端一起部署，无需分别配置
- **自动HTTPS**：自动提供SSL证书
- **全球CDN**：全球加速访问
- **自动部署**：推送代码自动重新部署

## 🔧 技术架构

- **前端**：Vue 3 + Vite（静态文件）
- **后端**：Vercel Serverless Functions（Node.js）
- **数据存储**：临时文件系统（重启后重置）
- **文件上传**：暂时禁用（Serverless限制）

## ⚠️ 注意事项

1. **数据持久性**：由于使用临时存储，服务器重启后数据会丢失
2. **文件上传**：Serverless环境不支持文件上传功能
3. **并发限制**：免费版有并发请求限制

## 🔄 数据持久化方案（可选）

如果需要数据持久化，可以考虑：

### 方案A：使用Vercel KV（推荐）
```bash
# 安装Vercel KV
npm install @vercel/kv
```

### 方案B：使用外部数据库
- **MongoDB Atlas**（免费500MB）
- **PlanetScale**（免费MySQL）
- **Supabase**（免费PostgreSQL）

## 📱 部署后的访问

部署成功后，你将获得：
- **网站地址**：`https://你的项目名.vercel.app`
- **API地址**：`https://你的项目名.vercel.app/api`

## 🎉 完成！

现在任何人都可以通过你的Vercel链接访问你的博客了！

## 💡 进阶配置

### 自定义域名
1. 在Vercel项目设置中添加自定义域名
2. 在域名提供商处添加DNS记录

### 环境变量
如果需要配置环境变量：
1. 在Vercel项目设置中添加环境变量
2. 重新部署项目

## 🆘 遇到问题？

常见问题解决：

1. **部署失败**：检查构建日志，确保所有依赖都已安装
2. **API不工作**：检查Serverless Functions是否正确部署
3. **CORS错误**：检查API函数中的CORS设置

---

这个方案完全免费，适合个人博客和小型项目使用！
