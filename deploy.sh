#!/bin/bash

echo "🚀 Starting deployment process..."

# Add all changes
echo "📝 Adding all changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Complete pricing system improvements, admin panel, and NextAuth fixes"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment script completed!"
echo "🌐 Your changes should now be deploying on Vercel..."
echo ""
echo "📋 What was deployed:"
echo "   ✅ Fixed Stripe checkout errors"
echo "   ✅ Added pricing to homepage"
echo "   ✅ Fixed Google OAuth redirect"
echo "   ✅ Added back to dashboard button"
echo "   ✅ Created superadmin system"
echo "   ✅ Optimized database storage"
echo "   ✅ Fixed NextAuth role types"
echo ""
echo "🎯 Next steps:"
echo "   1. Wait for Vercel to finish deploying"
echo "   2. Create superadmin: node create-superadmin.js"
echo "   3. Test the admin panel at /admin/users"
echo "   4. Verify Stripe checkout works"