Write-Host "🔄 Adding all new changes..." -ForegroundColor Yellow
git add .

Write-Host "📝 Committing all improvements..." -ForegroundColor Yellow
git commit -m "feat: Complete pricing system with admin panel, NextAuth role support, and deployment fixes

- Fixed Stripe checkout error handling
- Added pricing components to homepage
- Fixed Google OAuth redirect to dashboard
- Added back to dashboard button on subscription page
- Created superadmin system with user management panel
- Optimized database storage (removed report storage)
- Fixed NextAuth role type definitions
- Fixed PricingPlans import as named export
- Added admin panel at /admin/users for superadmins
- Created superadmin account creation script"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ All changes deployed! Vercel should build successfully now." -ForegroundColor Green
Read-Host "Press Enter to continue"
