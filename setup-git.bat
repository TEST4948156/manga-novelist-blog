@echo off
echo 🔧 设置 Git 仓库...
echo.

cd /d "%~dp0"

echo 📋 检查 Git 状态...
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 仓库未初始化，正在初始化...
    git init
    if errorlevel 1 (
        echo ❌ Git 初始化失败！
        pause
        exit /b 1
    )
    echo ✅ Git 仓库初始化成功！
) else (
    echo ✅ Git 仓库已存在
)

echo.
echo 📝 配置 Git 用户信息（如果需要）...
git config user.name >nul 2>&1
if errorlevel 1 (
    echo 请输入您的 Git 用户名:
    set /p username=
    git config user.name "%username%"
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo 请输入您的 Git 邮箱:
    set /p email=
    git config user.email "%email%"
)

echo.
echo 📦 添加文件到 Git...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败！
    pause
    exit /b 1
)

echo.
echo 💾 提交更改...
git commit -m "准备Netlify部署 - 添加Netlify Functions支持"
if errorlevel 1 (
    echo ❌ 提交失败！可能没有更改需要提交
)

echo.
echo 🌐 接下来需要创建 GitHub 仓库：
echo.
echo 1️⃣ 访问 https://github.com/new
echo 2️⃣ 创建新仓库（建议命名为 manga-novelist-website）
echo 3️⃣ 不要初始化 README、.gitignore 或 license
echo 4️⃣ 创建后，复制仓库 URL
echo.
echo 5️⃣ 然后运行以下命令（替换为您的仓库 URL）：
echo    git remote add origin https://github.com/您的用户名/仓库名.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 📋 或者使用以下模板命令：
echo.

echo git remote add origin https://github.com/YOUR_USERNAME/manga-novelist-website.git
echo git branch -M main  
echo git push -u origin main

echo.
echo 💡 提示：如果您已经有 GitHub 仓库，请告诉我 URL，我可以帮您设置！
echo.
pause
