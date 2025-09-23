@echo off
echo 🔄 Adding all changes...
git add .

echo 📝 Committing changes...
git commit -m "feat: Complete pricing system improvements and admin panel with NextAuth role fixes"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deployment complete! Your changes are now on GitHub and Vercel will auto-deploy.
pause
