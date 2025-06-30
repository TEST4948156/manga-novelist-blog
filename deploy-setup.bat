@echo off
echo 🚀 准备部署到云平台...
echo.

echo 📋 部署检查清单:
echo.

echo 1. 检查Git仓库状态...
git status
if %errorlevel% neq 0 (
    echo ❌ 请先初始化Git仓库: git init
    pause
    exit /b 1
)

echo.
echo 2. 检查是否有未提交的更改...
git diff --quiet
if %errorlevel% neq 0 (
    echo ⚠️  发现未提交的更改，正在提交...
    git add .
    git commit -m "准备部署: 更新项目配置"
)

echo.
echo 3. 检查远程仓库...
git remote -v
if %errorlevel% neq 0 (
    echo ❌ 请先添加远程仓库:
    echo    git remote add origin https://github.com/你的用户名/你的仓库名.git
    pause
    exit /b 1
)

echo.
echo 4. 推送到GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ 推送失败，请检查GitHub仓库设置
    pause
    exit /b 1
)

echo.
echo ✅ 代码已推送到GitHub!
echo.
echo 📝 接下来请按照以下步骤部署:
echo.
echo 🔗 后端部署 (Railway):
echo    1. 访问 https://railway.app
echo    2. 用GitHub登录
echo    3. 点击 "New Project" → "Deploy from GitHub repo"
echo    4. 选择你的仓库
echo    5. 设置根目录为 "server"
echo    6. 等待部署完成，复制URL
echo.
echo 🔗 前端部署 (Vercel):
echo    1. 访问 https://vercel.com
echo    2. 用GitHub登录
echo    3. 导入你的仓库
echo    4. 在环境变量中设置:
echo       VITE_API_BASE_URL = https://你的railway域名.railway.app/api
echo    5. 点击Deploy
echo.
echo 🎉 部署完成后，你就可以通过外部链接访问你的网站了!
echo.
pause
