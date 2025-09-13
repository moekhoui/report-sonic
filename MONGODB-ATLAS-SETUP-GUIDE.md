# 🚀 MongoDB Atlas Setup Guide for ReportSonic

## Step-by-Step MongoDB Atlas Configuration

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"**
3. Sign up with Google or email
4. Choose **"Free"** tier (M0 Sandbox)

### 2. Create Cluster
1. Choose **"AWS"** as provider
2. Select a region close to you (e.g., US East)
3. Keep default cluster name **"Cluster0"**
4. Click **"Create Cluster"**

### 3. Create Database User
1. Go to **"Database Access"** in the left menu
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username: `reportsonic`
5. Create password: `ReportSonic123!`
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### 4. Whitelist IP Address
1. Go to **"Network Access"** in the left menu
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 5. Get Connection String
1. Go to **"Clusters"** in the left menu
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Select Driver: Node.js**
5. **Select Version: 4.1 or later**
6. Copy the connection string

### 6. Update Connection String
Replace `<password>` with your actual password:

**Before:**
```
mongodb+srv://reportsonic:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://reportsonic:ReportSonic123!@cluster0.xxxxx.mongodb.net/reportsonic?retryWrites=true&w=majority
```

### 7. Add to Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Go to **"Settings"** → **"Environment Variables"**
3. Add new variable:
   - **Name:** `MONGODB_URI`
   - **Value:** Your connection string
   - **Environment:** Production, Preview, Development

### 8. Deploy to Vercel
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Your app will now use MongoDB Atlas!

## ✅ Driver Selection Summary

**When connecting to MongoDB Atlas:**
- **Driver:** Node.js
- **Version:** 4.1 or later
- **Connection Method:** Connect your application

## 🔧 Environment Variables for Vercel

```
MONGODB_URI=mongodb+srv://reportsonic:ReportSonic123!@cluster0.xxxxx.mongodb.net/reportsonic?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key_here
```

## 🎯 Why Node.js Driver?

- ✅ **Perfect for Next.js** (Node.js framework)
- ✅ **Works with Vercel** (Node.js runtime)
- ✅ **Compatible with mongoose** (our ODM)
- ✅ **Supports all MongoDB features**

## 🚀 That's It!

Your ReportSonic app will now have its own MongoDB database hosted in the cloud, completely free forever!
