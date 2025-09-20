@echo off
echo 🚀 Deploying ReportSonic to Vercel...
echo.

echo 📋 Your Environment Variables are already set:
echo ✅ GOOGLE_CLIENT_ID
echo ✅ GOOGLE_CLIENT_SECRET  
echo ✅ MONGODB_URI
echo ✅ NEXTAUTH_SECRET
echo.

echo 🔄 Starting deployment...
npx vercel --prod

echo.
echo ✅ Deployment complete!
echo 🌐 Check your Vercel dashboard for the live URL
echo.
pause
