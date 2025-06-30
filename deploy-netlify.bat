@echo off
echo 🚀 准备部署到 Netlify...
echo.

cd /d "%~dp0"

echo 📦 检查依赖...
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo 🔨 构建项目...
call npm run build-only
if errorlevel 1 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

echo.
echo ✅ 构建完成！
echo.
echo 📋 部署清单：
echo ✓ 前端代码已构建到 dist/ 目录
echo ✓ Netlify Functions 已准备在 netlify/functions/ 目录
echo ✓ 配置文件 netlify.toml 已就绪
echo.
echo 🌐 接下来请按照以下步骤部署：
echo.
echo 1️⃣ 将代码推送到 GitHub：
echo    git add .
echo    git commit -m "准备Netlify部署"
echo    git push origin main
echo.
echo 2️⃣ 在 Netlify 部署：
echo    - 访问 https://netlify.com
echo    - 用 GitHub 登录
echo    - 点击 "New site from Git"
echo    - 选择您的仓库
echo    - 构建设置会自动检测
echo.
echo 3️⃣ 设置环境变量：
echo    在 Site settings ^> Environment variables 中添加：
echo    DEEPSEEK_API_KEY = sk-5608f362dd6743a9a9d2880ea0b3c214
echo.
echo 4️⃣ 部署完成后测试：
echo    - 访问 Netlify 提供的 URL
echo    - 测试登录功能（admin/admin123）
echo    - 测试作品创建和点赞功能
echo    - 测试 AI 续写功能
echo.
echo 🎉 部署完成后，您的网站将通过 Netlify URL 全球访问！
echo.
pause
