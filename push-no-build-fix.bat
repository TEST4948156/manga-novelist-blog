@echo off
echo 🔧 推送跳过构建的修复...
echo.

cd /d "%~dp0"

echo 📝 提交修复...
git add netlify.toml prepare-netlify-deploy.bat
git commit -m "修复：跳过Netlify构建，使用预构建文件"

echo.
echo 🚀 推送到 GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ 推送失败！
    pause
    exit /b 1
)

echo.
echo ✅ 修复已推送！
echo.
echo 🎯 现在有两种部署方式：
echo.
echo 方式1：GitHub 自动部署（推荐）
echo 1. 返回 Netlify 控制台
echo 2. 点击 "Deploys" → "Trigger deploy" → "Deploy site"
echo 3. 这次应该会跳过构建直接部署
echo.
echo 方式2：手动拖拽部署
echo 1. 运行 .\prepare-netlify-deploy.bat
echo 2. 拖拽生成的文件夹到 Netlify
echo.
echo 💡 推荐先试方式1，如果还有问题再用方式2
echo.
pause
