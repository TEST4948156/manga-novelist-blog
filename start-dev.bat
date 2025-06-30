@echo off
echo 启动文笔部漫画风格的小说家网站...
echo.

echo 正在安装后端依赖...
cd server
call npm install
if %errorlevel% neq 0 (
    echo 后端依赖安装失败！
    pause
    exit /b 1
)

echo.
echo 启动后端服务器...
start "后端服务器" cmd /k "npm start"

echo.
echo 等待后端服务器启动...
timeout /t 3 /nobreak > nul

cd ..
echo 启动前端开发服务器...
start "前端服务器" cmd /k "npm run dev"

echo.
echo 服务启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3001
echo.
echo 按任意键关闭此窗口...
pause > nul
