#!/bin/bash

echo "🚀 Deploying ReportSonic to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at: https://your-project-name.vercel.app"
echo ""
echo "📝 Don't forget to set up environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - NEXTAUTH_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - GOOGLE_CLIENT_ID (optional)"
echo "   - GOOGLE_CLIENT_SECRET (optional)"

