@echo off
echo 🚀 ReportSonic - Quick Deploy to Vercel
echo.
echo Choose your deployment method:
echo.
echo 1. Deploy with Vercel CLI (requires Node.js)
echo 2. Open GitHub for manual upload
echo 3. Open Vercel dashboard
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
    echo.
    echo 🚀 Deploying to Vercel...
    vercel --prod
    goto end
)

if "%choice%"=="2" (
    echo.
    echo 🌐 Opening GitHub...
    start https://github.com/new
    echo.
    echo 📝 Instructions:
    echo 1. Create a new repository named "report-sonic"
    echo 2. Upload all files from D:\REPORT-SONIC
    echo 3. Make it public
    echo 4. Then go to vercel.com to deploy
    goto end
)

if "%choice%"=="3" (
    echo.
    echo 🌐 Opening Vercel...
    start https://vercel.com
    echo.
    echo 📝 Instructions:
    echo 1. Sign up with GitHub
    echo 2. Import your repository
    echo 3. Add environment variables
    echo 4. Deploy!
    goto end
)

echo Invalid choice. Please run the script again.
pause
goto end

:end
echo.
echo ✅ Done! Check QUICK-DEPLOY.md for detailed instructions.
pause
