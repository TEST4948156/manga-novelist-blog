@echo off
echo 🚀 启动小说家博客本地服务器...
echo.

cd /d "%~dp0"

if not exist "dist" (
    echo ❌ dist 文件夹不存在！
    echo 📦 正在构建项目...
    call npm run build
    if errorlevel 1 (
        echo ❌ 构建失败！
        pause
        exit /b 1
    )
)

echo ✅ 找到 dist 文件夹
echo.
echo 🌐 选择服务器类型：
echo 1. Python HTTP 服务器（推荐）
echo 2. Node.js serve
echo 3. PHP 内置服务器
echo.
set /p choice=请输入选择 (1-3): 

if "%choice%"=="1" (
    echo.
    echo 🐍 启动 Python HTTP 服务器...
    cd dist
    echo 📡 服务器地址: http://localhost:8080
    echo 🔄 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8080
) else if "%choice%"=="2" (
    echo.
    echo 📦 检查 serve 包...
    npx serve --version >nul 2>&1
    if errorlevel 1 (
        echo 📥 安装 serve 包...
        npm install -g serve
    )
    echo.
    echo 🟢 启动 Node.js 服务器...
    echo 📡 服务器地址: http://localhost:8080
    echo 🔄 按 Ctrl+C 停止服务器
    echo.
    npx serve dist -p 8080
) else if "%choice%"=="3" (
    echo.
    echo 🐘 启动 PHP 内置服务器...
    cd dist
    echo 📡 服务器地址: http://localhost:8080
    echo 🔄 按 Ctrl+C 停止服务器
    echo.
    php -S localhost:8080
) else (
    echo ❌ 无效选择！
    pause
    exit /b 1
)

echo.
echo 🎉 服务器已停止
pause
