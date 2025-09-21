const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 DEPLOYING AUTHENTICATION FIXES');
console.log('===================================\n');

try {
  // Check git status
  console.log('📋 Checking git status...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.trim()) {
    console.log('📝 Modified files:');
    console.log(gitStatus);
    
    // Add all changes
    console.log('\n📦 Adding changes to git...');
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit changes
    console.log('\n💾 Committing changes...');
    execSync('git commit -m "Fix: Remove default credentials and improve Google OAuth"', { stdio: 'inherit' });
    
    // Push to main branch
    console.log('\n🚀 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('\n✅ DEPLOYMENT COMPLETE!');
    console.log('========================');
    console.log('🔧 Fixes deployed:');
    console.log('- ✅ Removed default test credentials from sign-in form');
    console.log('- ✅ Improved Google OAuth error handling');
    console.log('- ✅ Added NextAuth secret configuration');
    console.log('- ✅ Created Google OAuth test page');
    
    console.log('\n⏳ Vercel will automatically deploy the changes...');
    console.log('📋 Check your deployment status at: https://vercel.com/dashboard');
    
    console.log('\n🧪 TESTING CHECKLIST:');
    console.log('=====================');
    console.log('1. ✅ Sign-in form no longer has default credentials');
    console.log('2. 🔍 Test Google Sign-In on live site');
    console.log('3. 🔍 Test email/password authentication');
    console.log('4. 🔍 Verify error handling works properly');
    
  } else {
    console.log('ℹ️  No changes to deploy');
  }
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  
  if (error.message.includes('not a git repository')) {
    console.log('\n💡 Git repository not initialized. Please run:');
    console.log('git init');
    console.log('git remote add origin <your-repo-url>');
  } else if (error.message.includes('Authentication failed')) {
    console.log('\n💡 Git authentication failed. Please check:');
    console.log('- Your GitHub credentials');
    console.log('- SSH keys or personal access tokens');
  }
}

console.log('\n🎉 Ready for testing!');
