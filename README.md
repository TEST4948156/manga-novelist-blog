# 文笔部 - 漫画风格小说家的创作空间

一个现代化的个人博客网站，专为创作者设计，用于记录和管理文学作品、文案和创意内容。

![项目预览](https://via.placeholder.com/800x400/667eea/ffffff?text=文笔部+博客)

## ✨ 功能特色

### 📝 **作品管理**
- 创建和编辑各种类型的作品（小说、短篇、文案、设定、对话）
- 支持文档和图片附件上传（最大5MB）
- 标签分类系统，便于作品检索
- 博客风格的文章展示

### 💾 **智能存储**
- 双模式存储：服务器存储 + 本地存储备份
- 自动检测服务器连接状态
- 离线模式下自动切换到本地存储
- 数据持久化保存

### 👍 **互动功能**
- 点赞系统（防重复点赞）
- 浏览量统计
- 实时状态显示
- 个人统计面板

### 🎨 **现代设计**
- 个人博客风格界面
- 响应式设计，完美适配移动端
- 侧边栏个人资料展示
- 清爽的卡片式布局

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装和运行

1. **克隆项目**
```bash
git clone [your-repo-url]
cd manga-novelist-website
```

2. **安装依赖**
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

3. **启动服务**

**方法一：一键启动（推荐）**
```bash
# Windows
start-dev.bat

# 或手动启动
npm run dev
```

**方法二：分别启动**
```bash
# 启动后端服务器
cd server
npm start

# 新开终端，启动前端
npm run dev
```

4. **访问网站**
- 前端地址: http://localhost:5173
- 后端API: http://localhost:3001

## 📁 项目结构

```
manga-novelist-website/
├── src/                    # 前端源码
│   ├── components/         # Vue组件
│   │   ├── WritingPortfolio.vue
│   │   ├── CharacterGallery.vue
│   │   ├── StoryArchive.vue
│   │   └── DetailModal.vue
│   ├── services/          # API服务
│   │   └── api.ts
│   ├── assets/            # 静态资源
│   └── App.vue            # 主应用组件
├── server/                # 后端服务器
│   ├── server.js          # Express服务器
│   ├── data/              # JSON数据存储
│   ├── uploads/           # 文件上传目录
│   └── package.json       # 后端依赖
├── public/                # 公共资源
└── README.md              # 项目说明
```

## 🔧 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **CSS3** - 现代样式设计

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web框架
- **JSON文件存储** - 轻量级数据存储
- **Multer** - 文件上传处理

## 🌐 API接口

### 作品相关
- `GET /api/works` - 获取作品列表
- `GET /api/works/:id` - 获取单个作品
- `POST /api/works` - 创建作品
- `PUT /api/works/:id` - 更新作品
- `DELETE /api/works/:id` - 删除作品

### 互动功能
- `POST /api/works/:id/like` - 点赞作品
- `GET /api/stats` - 获取统计信息

## 📱 使用说明

1. **创建文章**: 点击"写新文章"按钮，填写标题、内容、标签等信息
2. **上传附件**: 支持文档和图片文件，最大5MB
3. **查看详情**: 点击"阅读全文"查看完整内容
4. **点赞互动**: 点击❤️按钮为喜欢的作品点赞
5. **状态监控**: 页面顶部显示服务器连接状态

## 🔄 部署说明

### 开发环境
```bash
npm run dev          # 前端开发服务器
cd server && npm start  # 后端服务器
```

### 生产环境
```bash
npm run build        # 构建前端
# 部署dist目录到静态服务器
# 部署server目录到Node.js服务器
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
