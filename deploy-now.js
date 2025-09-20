// Simple deployment script for Vercel
const { execSync } = require('child_process');

console.log('🚀 Starting ReportSonic deployment to Vercel...');

try {
  // Install Vercel CLI globally
  console.log('📦 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
  
  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🌐 Your app is now live!');
  console.log('');
  console.log('📝 Don\'t forget to set up environment variables in Vercel dashboard:');
  console.log('   - MONGODB_URI=mongodb+srv://reportsonic:reportsonic123@cluster0.mongodb.net/reportsonic?retryWrites=true&w=majority');
  console.log('   - NEXTAUTH_URL=https://your-project-name.vercel.app');
  console.log('   - NEXTAUTH_SECRET=your-secret-key-here');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('');
  console.log('🔄 Alternative: Deploy manually at https://vercel.com');
  console.log('1. Go to vercel.com');
  console.log('2. Sign up with GitHub');
  console.log('3. Import this repository');
  console.log('4. Add environment variables');
  console.log('5. Deploy!');
}
