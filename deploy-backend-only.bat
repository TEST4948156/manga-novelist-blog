@echo off
echo 🚀 创建纯后端部署包...
echo.

cd /d "%~dp0"

echo 📁 创建后端部署文件夹...
if exist "backend-deploy" rmdir /s /q "backend-deploy"
mkdir "backend-deploy"

echo.
echo 📋 复制后端文件...
echo 复制 Netlify Functions...
xcopy "netlify" "backend-deploy\netlify\" /E /I /Y

echo 复制前端构建文件（用于托管）...
if exist "dist" (
    xcopy "dist\*" "backend-deploy\" /E /I /Y
) else (
    echo ⚠️ 没有找到 dist 文件夹，正在构建...
    call npm run build
    if not errorlevel 1 (
        xcopy "dist\*" "backend-deploy\" /E /I /Y
    ) else (
        echo ❌ 构建失败，创建简单的 index.html
        echo ^<html^>^<body^>^<h1^>API Server^</h1^>^<p^>Backend is running at /api/*^</p^>^</body^>^</html^> > "backend-deploy\index.html"
    )
)

echo.
echo 📝 创建后端专用配置...
(
echo [build]
echo   publish = "."
echo   functions = "netlify/functions"
echo.
echo [[redirects]]
echo   from = "/api/*"
echo   to = "/.netlify/functions/:splat"
echo   status = 200
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
echo.
echo [build.environment]
echo   NODE_VERSION = "18"
) > "backend-deploy\netlify.toml"

echo.
echo 📦 创建简化的 package.json...
(
echo {
echo   "name": "manga-novelist-backend",
echo   "version": "1.0.0",
echo   "dependencies": {
echo     "axios": "^1.10.0",
echo     "uuid": "^10.0.0"
echo   }
echo }
) > "backend-deploy\package.json"

echo.
echo ✅ 后端部署包创建完成！
echo.
echo 📂 部署包位置：backend-deploy 文件夹
echo.
echo 🚀 部署方式：
echo 1. 拖拽部署：将 backend-deploy 文件夹拖拽到 https://netlify.com
echo 2. 或者压缩后上传
echo.
echo 🔧 部署后设置：
echo 在 Netlify 控制台设置环境变量：
echo DEEPSEEK_API_KEY = sk-5608f362dd6743a9a9d2880ea0b3c214
echo.
echo 🧪 测试 API：
echo 部署后访问：https://your-site.netlify.app/api/stats
echo.
pause
