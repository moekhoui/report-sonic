# Free MongoDB Database Setup

## Option 1: MongoDB Atlas (Free Tier) - RECOMMENDED

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" 
3. Sign up with Google or email
4. Choose "Free" tier (M0 Sandbox)

### Step 2: Create Cluster
1. Choose "AWS" as provider
2. Select a region close to you
3. Keep default cluster name "Cluster0"
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `reportsonic`
5. Create password: `ReportSonic123!`
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

### Step 6: Update Environment Variables
Replace the connection string with your actual MongoDB Atlas URI:

```
MONGODB_URI=mongodb+srv://reportsonic:ReportSonic123!@cluster0.xxxxx.mongodb.net/reportsonic?retryWrites=true&w=majority
```

## Option 2: Railway (Free Tier)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Add MongoDB Service
1. Click "New" → "Database" → "MongoDB"
2. Wait for deployment
3. Copy the connection string from the MongoDB service

### Step 3: Update Environment Variables
Use the Railway MongoDB connection string in your environment variables.

## Option 3: PlanetScale (MySQL) - Alternative

If you prefer MySQL over MongoDB:

### Step 1: Create PlanetScale Account
1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create new database

### Step 2: Get Connection String
1. Go to your database
2. Click "Connect"
3. Copy the connection string

## Environment Variables for Vercel

Add these to your Vercel project settings:

```
MONGODB_URI=your_connection_string_here
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Quick Setup Commands

```bash
# Install MongoDB locally (for development)
npm install mongodb

# Or use the simple in-memory database
# (Already included in the project)
```

## Testing Database Connection

```bash
# Test the connection
npm run dev
# Visit http://localhost:3000/api/health
```

Choose Option 1 (MongoDB Atlas) for the best free experience!
