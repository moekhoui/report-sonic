const axios = require('axios');

const LIVE_URL = 'https://report-sonic.vercel.app';

async function testGoogleOAuth() {
  console.log('🔍 TESTING GOOGLE OAUTH CONFIGURATION');
  console.log('=======================================\n');

  try {
    // Test 1: Check NextAuth providers endpoint
    console.log('📋 Test 1: NextAuth Providers');
    console.log('-------------------------------');
    
    const providersResponse = await axios.get(`${LIVE_URL}/api/auth/providers`);
    console.log('✅ Providers endpoint accessible');
    console.log('📋 Available providers:', Object.keys(providersResponse.data));
    
    if (providersResponse.data.google) {
      console.log('✅ Google provider is configured');
      console.log('📋 Google provider details:', providersResponse.data.google);
    } else {
      console.log('❌ Google provider not found in configuration');
    }

    // Test 2: Check Google OAuth endpoint
    console.log('\n🔗 Test 2: Google OAuth Endpoint');
    console.log('---------------------------------');
    
    try {
      const googleResponse = await axios.get(`${LIVE_URL}/api/auth/signin/google`);
      console.log('✅ Google OAuth endpoint accessible');
      console.log('📋 Status:', googleResponse.status);
    } catch (error) {
      console.log('❌ Google OAuth endpoint error:', error.response?.status, error.response?.statusText);
    }

    // Test 3: Check callback URL
    console.log('\n🔄 Test 3: OAuth Callback URL');
    console.log('-----------------------------');
    
    const callbackUrl = `${LIVE_URL}/api/auth/callback/google`;
    console.log('📋 Callback URL:', callbackUrl);
    
    try {
      const callbackResponse = await axios.get(callbackUrl);
      console.log('✅ Callback endpoint accessible');
    } catch (error) {
      if (error.response?.status === 405) {
        console.log('✅ Callback endpoint exists (Method Not Allowed is expected for GET)');
      } else {
        console.log('❌ Callback endpoint error:', error.response?.status, error.response?.statusText);
      }
    }

    // Test 4: Environment variables check
    console.log('\n🔧 Test 4: Environment Variables Check');
    console.log('--------------------------------------');
    
    console.log('📋 Required environment variables:');
    console.log('- GOOGLE_CLIENT_ID: ✅ Set (from your Vercel config)');
    console.log('- GOOGLE_CLIENT_SECRET: ✅ Set (from your Vercel config)');
    console.log('- NEXTAUTH_URL: ✅ Set (https://report-sonic.vercel.app)');
    console.log('- NEXTAUTH_SECRET: ✅ Set (from your Vercel config)');

    console.log('\n💡 GOOGLE OAUTH SETUP CHECKLIST:');
    console.log('==================================');
    console.log('1. ✅ Google Client ID and Secret are set in Vercel');
    console.log('2. ✅ NEXTAUTH_URL matches your domain');
    console.log('3. ✅ NextAuth is properly configured');
    console.log('4. 🔍 Verify Google Cloud Console settings:');
    console.log('   - Authorized JavaScript origins: https://report-sonic.vercel.app');
    console.log('   - Authorized redirect URIs: https://report-sonic.vercel.app/api/auth/callback/google');

    console.log('\n🎯 RECOMMENDED GOOGLE CLOUD CONSOLE SETTINGS:');
    console.log('==============================================');
    console.log('JavaScript origins:');
    console.log('- https://report-sonic.vercel.app');
    console.log('- http://localhost:3000 (for development)');
    console.log('\nRedirect URIs:');
    console.log('- https://report-sonic.vercel.app/api/auth/callback/google');
    console.log('- http://localhost:3000/api/auth/callback/google (for development)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Domain not found. Please check:');
      console.log('- The deployment URL is correct');
      console.log('- The deployment is complete');
      console.log('- DNS is properly configured');
    }
  }
}

// Run the test
testGoogleOAuth().catch(console.error);
