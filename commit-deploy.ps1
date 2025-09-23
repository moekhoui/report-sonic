Write-Host "🔄 Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host "📝 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Complete pricing system improvements and admin panel with NextAuth role fixes"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deployment complete! Your changes are now on GitHub and Vercel will auto-deploy." -ForegroundColor Green
Read-Host "Press Enter to continue"
