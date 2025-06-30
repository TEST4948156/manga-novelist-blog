@echo off
echo 🚀 准备 Netlify 部署（跳过构建）...
echo.

cd /d "%~dp0"

echo 🔨 确保本地构建完成...
if not exist "dist" (
    echo 正在本地构建...
    call npm run build
    if errorlevel 1 (
        echo ❌ 本地构建失败！请检查错误
        pause
        exit /b 1
    )
) else (
    echo ✅ 发现 dist 文件夹
)

echo.
echo 📁 创建完整部署包...
if exist "netlify-final-deploy" rmdir /s /q "netlify-final-deploy"
mkdir "netlify-final-deploy"

echo.
echo 📋 复制所有必要文件...

echo 复制前端构建文件...
xcopy "dist\*" "netlify-final-deploy\" /E /I /Y

echo 复制 Netlify Functions...
xcopy "netlify" "netlify-final-deploy\netlify\" /E /I /Y

echo 复制配置文件...
copy "netlify.toml" "netlify-final-deploy\"

echo 复制 package.json（Functions需要）...
copy "package.json" "netlify-final-deploy\"

echo.
echo 📝 创建 .gitkeep 文件确保文件夹结构...
echo. > "netlify-final-deploy\netlify\functions\.gitkeep"

echo.
echo 🔍 检查部署包内容...
echo 📂 netlify-final-deploy 文件夹包含：
dir "netlify-final-deploy" /B
echo.
echo 📂 Functions 文件夹包含：
dir "netlify-final-deploy\netlify\functions" /B

echo.
echo ✅ 部署包准备完成！
echo.
echo 📦 部署包位置：netlify-final-deploy 文件夹
echo.
echo 🚀 部署步骤：
echo 1. 访问 https://netlify.com
echo 2. 拖拽 netlify-final-deploy 文件夹到页面
echo 3. 等待部署完成（应该很快，因为跳过了构建）
echo.
echo ⚙️ 部署后必须设置环境变量：
echo 在 Site settings ^> Environment variables 中添加：
echo DEEPSEEK_API_KEY = sk-5608f362dd6743a9a9d2880ea0b3c214
echo.
echo 🧪 测试 API 端点：
echo https://your-site.netlify.app/api/stats
echo https://your-site.netlify.app/api/works
echo https://your-site.netlify.app/api/activities
echo.
pause
