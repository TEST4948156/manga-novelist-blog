@echo off
echo 🔧 初始化Git仓库...
echo.

cd /d "%~dp0"
echo 当前目录: %CD%

echo.
echo 1. 初始化Git仓库...
git init

echo.
echo 2. 添加所有文件...
git add .

echo.
echo 3. 创建初始提交...
git commit -m "初始提交: 文笔部博客项目"

echo.
echo ✅ Git仓库初始化完成!
echo.
echo 📝 接下来请:
echo 1. 在GitHub上创建新仓库
echo 2. 复制仓库URL
echo 3. 运行: git remote add origin https://github.com/你的用户名/仓库名.git
echo 4. 运行: git push -u origin main
echo.
echo 然后就可以部署到云平台了!
echo.
pause
