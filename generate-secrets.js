#!/usr/bin/env node

console.log('🔑 Generating Environment Variables for ReportSonic');
console.log('================================================\n');

// Generate NEXTAUTH_SECRET
const crypto = require('crypto');
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

console.log('✅ NEXTAUTH_SECRET Generated:');
console.log(nextAuthSecret);
console.log('');

console.log('📋 Complete Environment Variables for Vercel:');
console.log('');
console.log('# Required Variables');
console.log('MONGODB_URI=mongodb+srv://khouildimy_db_user:2A5hvPZkkDbqJL9@report-sonic.zagspw2.mongodb.net/reportsonic?retryWrites=true&w=majority&appName=report-sonic');
console.log('NEXTAUTH_URL=https://your-app.vercel.app');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
console.log('');
console.log('# Optional Variables (add later)');
console.log('GOOGLE_CLIENT_ID=your-google-client-id');
console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret');
console.log('STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key');
console.log('STRIPE_SECRET_KEY=your-stripe-secret-key');
console.log('STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret');
console.log('');

console.log('🚀 Quick Setup Steps:');
console.log('');
console.log('1. Deploy to Vercel first');
console.log('2. Copy the Vercel URL as NEXTAUTH_URL');
console.log('3. Add these 3 variables to Vercel:');
console.log('   - MONGODB_URI (already provided)');
console.log('   - NEXTAUTH_URL (from Vercel)');
console.log('   - NEXTAUTH_SECRET (generated above)');
console.log('');
console.log('4. Redeploy your app');
console.log('5. Add Google OAuth and Stripe later (optional)');
console.log('');

console.log('✨ Your app will work with just these 3 variables!');
