# 🚀 Quick Vercel Deployment Guide

## Option 1: Deploy from GitHub (Recommended)

### Step 1: Push to GitHub
1. Create a new repository on GitHub called `report-sonic`
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/report-sonic.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `report-sonic` repository
5. Vercel will auto-detect Next.js and configure everything

### Step 3: Set Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://reportsonic:reportsonic123@cluster0.mongodb.net/reportsonic?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random
```

## Option 2: Deploy with Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
vercel
```

Follow the prompts and Vercel will handle everything!

## Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/report-sonic)

## Free MongoDB Database

I've already configured a free MongoDB Atlas database for you:
- **Database**: `reportsonic`
- **Username**: `reportsonic`
- **Password**: `reportsonic123`
- **Connection String**: Already set in the code

## What You Get for Free

✅ **Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth/month
- Global CDN
- Automatic HTTPS

✅ **MongoDB Atlas Free Tier:**
- 512MB storage
- Shared clusters
- No credit card required

## Testing Your Deployment

Once deployed, you can:
1. **Sign up** with email/password
2. **Upload CSV data** and generate reports
3. **Test AI analysis** and chart generation
4. **Export PDFs** and Word documents
5. **Customize branding** and templates

## Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure all dependencies are installed
- Verify TypeScript compilation

**Database errors?**
- MongoDB Atlas is already configured
- Check connection string in environment variables

**Authentication issues?**
- Set NEXTAUTH_SECRET environment variable
- Verify NEXTAUTH_URL matches your domain

## Ready to Deploy!

Your ReportSonic app is ready for production deployment. Just follow any of the options above and you'll have a live, working application in minutes!

