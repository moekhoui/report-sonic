@echo off
echo 🚀 ReportSonic - Minimal Deploy to Vercel
echo.
echo This will create a minimal working version for Vercel deployment.
echo.

echo 📦 Creating minimal package.json...
copy package-minimal.json package.json
echo ✅ package.json updated

echo.
echo 📁 Checking pages directory...
if exist pages (
    echo ✅ pages directory exists
    dir pages
) else (
    echo ❌ pages directory not found!
    pause
    exit
)

echo.
echo 🚀 Ready to deploy!
echo.
echo Next steps:
echo 1. Upload ALL files to GitHub
echo 2. Go to vercel.com
echo 3. Import your repository
echo 4. Deploy!
echo.
echo Test URLs after deployment:
echo - / (homepage)
echo - /test (test page)
echo - /api/hello (API test)
echo.
pause
