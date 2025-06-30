@echo off
echo 📦 创建 Netlify 部署包...
echo.

cd /d "%~dp0"

echo 🔨 确保本地构建完成...
if not exist "dist" (
    echo 正在构建前端...
    call npm run build
    if errorlevel 1 (
        echo ❌ 构建失败！
        pause
        exit /b 1
    )
)

echo.
echo 📁 创建部署文件夹...
if exist "netlify-deploy" rmdir /s /q "netlify-deploy"
mkdir "netlify-deploy"

echo.
echo 📋 复制必要文件...
echo 复制前端构建文件...
xcopy "dist\*" "netlify-deploy\" /E /I /Y

echo 复制 Netlify Functions...
xcopy "netlify" "netlify-deploy\netlify\" /E /I /Y

echo 复制配置文件...
copy "netlify.toml" "netlify-deploy\"
copy "package.json" "netlify-deploy\"

echo.
echo ✅ 部署包创建完成！
echo.
echo 📂 部署包位置：netlify-deploy 文件夹
echo.
echo 🚀 接下来请：
echo 1. 访问 https://netlify.com
echo 2. 将 netlify-deploy 文件夹拖拽到 Netlify 控制台
echo 3. 或者压缩 netlify-deploy 文件夹后上传
echo.
echo 💡 部署后记得设置环境变量：
echo DEEPSEEK_API_KEY = sk-5608f362dd6743a9a9d2880ea0b3c214
echo.
pause
