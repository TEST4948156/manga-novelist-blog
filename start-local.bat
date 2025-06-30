@echo off
echo 🚀 启动小说家博客本地服务...
echo.

cd /d "%~dp0"

echo 📦 检查依赖...
if not exist "node_modules" (
    echo 安装前端依赖...
    call npm install
)

if not exist "server\node_modules" (
    echo 安装后端依赖...
    cd server
    call npm install
    cd ..
)

echo.
echo 🌐 启动服务器...
echo.

echo 启动后端服务器...
start "后端服务器" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo 启动前端服务器...
start "前端服务器" cmd /k "npm run dev"

echo.
echo ✅ 服务启动完成！
echo.
echo 📱 访问地址：
echo 前端: http://localhost:5173
echo 后端: http://localhost:3001
echo.
echo 🔐 登录信息：
echo 用户名: admin
echo 密码: admin123
echo.
echo 💡 提示：
echo - 关闭此窗口不会停止服务器
echo - 要停止服务器，请关闭对应的命令行窗口
echo - 数据会保存在 server/data 文件夹中
echo.
pause
