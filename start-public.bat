@echo off
echo 🌐 启动公网访问的小说家博客...
echo.

cd /d "%~dp0"

echo 📦 检查本地服务...
echo.

echo 1. 启动本地服务器...
start "本地服务" cmd /k "start-local.bat"

echo.
echo 等待服务启动...
timeout /t 10 /nobreak >nul

echo.
echo 2. 检查 ngrok 是否安装...
ngrok version >nul 2>&1
if errorlevel 1 (
    echo ❌ ngrok 未安装！
    echo.
    echo 📥 请先安装 ngrok：
    echo 1. 访问 https://ngrok.com
    echo 2. 注册账号并下载 ngrok
    echo 3. 将 ngrok.exe 放到系统 PATH 中
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok 已安装
echo.

echo 3. 启动 ngrok 隧道...
echo.
echo 🌐 启动前端隧道（端口 5173）...
start "前端隧道" cmd /k "echo 前端公网地址: && ngrok http 5173"

timeout /t 3 /nobreak >nul

echo 🔧 启动后端隧道（端口 3001）...
start "后端隧道" cmd /k "echo 后端公网地址: && ngrok http 3001"

echo.
echo ✅ 公网访问已启动！
echo.
echo 📋 使用说明：
echo 1. 查看 ngrok 窗口获取公网地址
echo 2. 前端地址类似：https://abc123.ngrok.io
echo 3. 后端地址类似：https://def456.ngrok.io
echo 4. 需要修改前端配置指向后端地址
echo.
echo ⚠️ 注意：
echo - ngrok 免费版地址会变化
echo - 关闭窗口会断开公网访问
echo - 数据仍保存在本地
echo.
pause
