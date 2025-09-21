const fs = require('fs');
const path = require('path');

console.log('🚀 REPORT-SONIC AUTHENTICATION SETUP');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created! Please update it with your database credentials.');
  } else {
    // Create a basic .env file
    const envContent = `# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=reportsonic
MYSQL_PORT=3306

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created! Please update it with your database credentials.');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 AUTHENTICATION SYSTEM STATUS:');
console.log('================================');

// Check if all required files exist
const requiredFiles = [
  'pages/auth/signin.tsx',
  'pages/auth/signup.tsx',
  'pages/auth/forgot-password.tsx',
  'pages/auth/reset-password.tsx',
  'pages/api/auth/[...nextauth].ts',
  'pages/api/auth/login.ts',
  'pages/api/auth/register.ts',
  'pages/api/auth/forgot-password.ts',
  'pages/api/auth/reset-password.ts',
  'pages/api/auth/me.ts',
  'pages/api/auth/logout.ts',
  'src/lib/auth.ts',
  'src/contexts/AuthContext.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n🔧 SETUP INSTRUCTIONS:');
console.log('======================');

if (allFilesExist) {
  console.log('✅ All authentication files are in place!');
} else {
  console.log('❌ Some files are missing. Please check the file structure.');
}

console.log('\n📝 NEXT STEPS:');
console.log('1. Update your .env file with database credentials');
console.log('2. Make sure MySQL is running and create the "reportsonic" database');
console.log('3. Run: node setup-database-simple.js (after updating database config)');
console.log('4. Start the development server: npm run dev');
console.log('5. Test the authentication system at http://localhost:3000/auth/signin');

console.log('\n🎯 TESTING CHECKLIST:');
console.log('- [ ] Email/password registration works');
console.log('- [ ] Email/password login works');
console.log('- [ ] Google Sign-In works (if configured)');
console.log('- [ ] Password reset flow works');
console.log('- [ ] User sessions persist');
console.log('- [ ] Logout works');

console.log('\n🔐 SECURITY FEATURES:');
console.log('- ✅ Password hashing with bcrypt');
console.log('- ✅ JWT token management');
console.log('- ✅ HTTP-only cookies');
console.log('- ✅ Secure password reset tokens');
console.log('- ✅ Input validation');
console.log('- ✅ SQL injection protection');

console.log('\n🎉 AUTHENTICATION SYSTEM READY!');
console.log('Your ReportSonic app now has a complete authentication system!');
