@echo off
echo 🛑 停止小说家博客服务...
echo.

echo 正在停止 Node.js 进程...
taskkill /f /im node.exe >nul 2>&1

echo 正在停止开发服务器...
taskkill /f /im "npm.exe" >nul 2>&1

echo.
echo ✅ 所有服务已停止！
echo.
pause
