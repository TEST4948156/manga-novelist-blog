@echo off
echo 🚀 一键部署到Vercel...
echo.

cd /d "%~dp0"

echo 📋 检查Git状态...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 初始化Git仓库...
    git init
)

echo.
echo 📦 添加所有文件...
git add .

echo.
echo 💾 创建提交...
git commit -m "准备部署: 更新为Vercel Serverless Functions"

echo.
echo 📤 检查远程仓库...
git remote -v | findstr origin >nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ 请先设置GitHub远程仓库:
    echo.
    echo 1. 在GitHub上创建新仓库
    echo 2. 复制仓库URL
    echo 3. 运行: git remote add origin https://github.com/你的用户名/仓库名.git
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 推送到GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ⚠️  推送可能失败，请检查GitHub设置
)

echo.
echo ✅ 代码已推送到GitHub!
echo.
echo 🌐 接下来请访问 https://vercel.com 进行部署:
echo.
echo 📝 部署步骤:
echo 1. 用GitHub账户登录Vercel
echo 2. 点击 "New Project"
echo 3. 选择你的GitHub仓库
echo 4. 直接点击 "Deploy"（无需任何配置）
echo 5. 等待部署完成
echo.
echo 🎉 部署完成后，你就可以通过外部链接访问你的博客了!
echo.
echo 💡 特点:
echo - 完全免费
echo - 自动HTTPS
echo - 全球CDN加速
echo - 自动部署（推送代码即更新）
echo.
pause
