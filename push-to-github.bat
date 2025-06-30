@echo off
echo 🚀 推送代码到 GitHub...
echo.

cd /d "%~dp0"

echo 📋 检查 Git 状态...
git status
if errorlevel 1 (
    echo ❌ Git 仓库有问题！
    pause
    exit /b 1
)

echo.
echo 🔧 设置远程仓库...
git remote set-url origin https://github.com/TEST4948156/manga-novelist-blog.git
if errorlevel 1 (
    echo 尝试添加远程仓库...
    git remote add origin https://github.com/TEST4948156/manga-novelist-blog.git
)

echo.
echo 📦 添加所有文件...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败！
    pause
    exit /b 1
)

echo.
echo 💾 提交更改...
git commit -m "添加Netlify Functions支持 - 准备部署"
if errorlevel 1 (
    echo ⚠️ 没有新的更改需要提交，或提交失败
)

echo.
echo 🌐 推送到 GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo ❌ 推送失败！可能需要身份验证
    echo.
    echo 💡 如果需要身份验证，请：
    echo 1. 确保您已登录 GitHub
    echo 2. 或者使用 Personal Access Token
    echo 3. 或者在浏览器中访问 GitHub 并确认权限
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 代码推送成功！
echo.
echo 🎯 接下来请：
echo 1. 访问 https://netlify.com
echo 2. 用 GitHub 登录
echo 3. 选择 "New site from Git"
echo 4. 选择 manga-novelist-blog 仓库
echo 5. 部署设置会自动检测
echo 6. 在环境变量中添加 DEEPSEEK_API_KEY
echo.
echo 🌐 您的仓库地址：
echo https://github.com/TEST4948156/manga-novelist-blog
echo.
pause
