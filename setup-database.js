#!/usr/bin/env node

console.log('🚀 ReportSonic Database Setup');
console.log('============================\n');

console.log('📋 Choose your database option:');
console.log('');
console.log('1. MongoDB Atlas (Free) - RECOMMENDED');
console.log('   ✅ Free forever for small projects');
console.log('   ✅ 512MB storage');
console.log('   ✅ Shared clusters');
console.log('   ✅ Perfect for Vercel deployment');
console.log('');
console.log('2. Simple In-Memory Database (Development)');
console.log('   ⚠️ Data is lost when server restarts');
console.log('   ✅ No setup required');
console.log('   ✅ Good for testing');
console.log('');

console.log('🔗 Quick Setup Links:');
console.log('');
console.log('MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
console.log('Railway (Alternative): https://railway.app');
console.log('');

console.log('📝 Steps to set up MongoDB Atlas:');
console.log('');
console.log('1. Go to https://www.mongodb.com/cloud/atlas');
console.log('2. Click "Try Free" and sign up');
console.log('3. Create a new cluster (choose free tier)');
console.log('4. Create a database user');
console.log('5. Whitelist your IP address (0.0.0.0/0 for Vercel)');
console.log('6. Get your connection string');
console.log('7. Add it to your Vercel environment variables');
console.log('');

console.log('🔧 Environment Variables for Vercel:');
console.log('');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/reportsonic?retryWrites=true&w=majority');
console.log('NEXTAUTH_URL=https://your-app.vercel.app');
console.log('NEXTAUTH_SECRET=your-secret-key-here');
console.log('');

console.log('✨ That\'s it! Your database will be ready for deployment.');
console.log('');
console.log('💡 If you don\'t set up MongoDB Atlas, the app will use a simple in-memory database for testing.');
