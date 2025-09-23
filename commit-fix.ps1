Write-Host "🔄 Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host "📝 Committing import fix..." -ForegroundColor Yellow
git commit -m "fix: Import PricingPlans as named export to resolve compilation error"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Fix deployed! Vercel should now build successfully." -ForegroundColor Green
Read-Host "Press Enter to continue"
