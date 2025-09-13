# 🚀 ReportSonic Deployment Guide

## Free Deployment on Vercel + MongoDB Atlas

This guide will help you deploy ReportSonic to Vercel for free testing without any local setup.

### Step 1: Set up MongoDB Atlas (Free Database)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account** (no credit card required)
3. **Create a new cluster:**
   - Choose "M0 Sandbox" (Free tier)
   - Select a region close to you
   - Name it "reportsonic-cluster"
4. **Create a database user:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `reportsonic`
   - Password: `reportsonic123` (or generate a secure one)
   - Role: "Atlas admin"
5. **Whitelist your IP:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get your connection string:**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://reportsonic:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password
   - Add `/reportsonic` at the end before `?retryWrites=true`

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up with GitHub** (free)
3. **Import your project:**
   - Click "New Project"
   - Import from GitHub (you'll need to push your code to GitHub first)
   - Or use Vercel CLI: `npx vercel`

### Step 3: Configure Environment Variables

In your Vercel dashboard, go to your project → Settings → Environment Variables and add:

```env
MONGODB_URI=mongodb+srv://reportsonic:yourpassword@cluster0.xxxxx.mongodb.net/reportsonic?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 4: Set up Google OAuth (Optional)

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Create a new project** or select existing
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials:**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://your-project-name.vercel.app/api/auth/callback/google`
5. **Copy Client ID and Secret** to Vercel environment variables

### Step 5: Deploy and Test

1. **Push your code to GitHub** (if not already done)
2. **Connect Vercel to your GitHub repository**
3. **Vercel will automatically deploy** your application
4. **Visit your live URL** (e.g., `https://report-sonic.vercel.app`)

### 🎉 You're Done!

Your ReportSonic application is now live and ready for testing!

## Quick Start (No Local Setup Required)

If you want to deploy immediately without any local setup:

1. **Fork this repository** on GitHub
2. **Go to Vercel** and import the forked repository
3. **Add the environment variables** (use the MongoDB URI provided above)
4. **Deploy!**

## Features Available in Free Tier

✅ **MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared clusters
- No credit card required

✅ **Vercel Free Tier:**
- Unlimited personal projects
- 100GB bandwidth per month
- Automatic HTTPS
- Global CDN

## Troubleshooting

**If you get database connection errors:**
- Check your MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify your database user credentials

**If authentication doesn't work:**
- Check your NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your Vercel domain
- Ensure Google OAuth credentials are correct

**If the app doesn't build:**
- Check the Vercel build logs
- Ensure all dependencies are in package.json
- Verify TypeScript compilation

## Next Steps

Once deployed, you can:
1. Test the full application flow
2. Create sample reports
3. Test data upload functionality
4. Customize branding and templates
5. Set up payment processing (Stripe) when ready

## Support

If you encounter any issues:
1. Check the Vercel function logs
2. Review MongoDB Atlas logs
3. Check the browser console for errors
4. Verify all environment variables are set correctly

