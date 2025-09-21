const axios = require('axios');

const LOCAL_URL = 'http://localhost:3002'; // Based on your terminal output

async function testLocalAuth() {
  console.log('🧪 TESTING LOCAL AUTHENTICATION');
  console.log('=================================\n');

  try {
    // Test 1: Check if local server is running
    console.log('🏠 Test 1: Local Server Check');
    console.log('------------------------------');
    
    const homeResponse = await axios.get(LOCAL_URL);
    console.log('✅ Local server is running');
    console.log('📋 Status:', homeResponse.status);

    // Test 2: Check sign-in page
    console.log('\n🔐 Test 2: Sign-in Page');
    console.log('-------------------------');
    
    const signinResponse = await axios.get(`${LOCAL_URL}/auth/signin`);
    console.log('✅ Sign-in page loads');
    console.log('📋 Status:', signinResponse.status);

    // Test 3: Check sign-up page
    console.log('\n📝 Test 3: Sign-up Page');
    console.log('-------------------------');
    
    const signupResponse = await axios.get(`${LOCAL_URL}/auth/signup`);
    console.log('✅ Sign-up page loads');
    console.log('📋 Status:', signupResponse.status);

    // Test 4: Test registration API
    console.log('\n📝 Test 4: Registration API');
    console.log('-----------------------------');
    
    const testEmail = `test-${Date.now()}@reportsonic.com`;
    const registerResponse = await axios.post(`${LOCAL_URL}/api/auth/register`, {
      name: 'Local Test User',
      email: testEmail,
      password: 'test123456'
    });
    
    console.log('✅ Registration successful');
    console.log('📋 User created:', registerResponse.data.user);

    // Test 5: Test login API
    console.log('\n🔐 Test 5: Login API');
    console.log('----------------------');
    
    const loginResponse = await axios.post(`${LOCAL_URL}/api/auth/login`, {
      email: testEmail,
      password: 'test123456'
    });
    
    console.log('✅ Login successful');
    console.log('📋 User logged in:', loginResponse.data.user);

    // Test 6: Test NextAuth providers
    console.log('\n🔍 Test 6: NextAuth Providers');
    console.log('-------------------------------');
    
    try {
      const providersResponse = await axios.get(`${LOCAL_URL}/api/auth/providers`);
      console.log('✅ NextAuth providers endpoint works');
      console.log('📋 Available providers:', Object.keys(providersResponse.data));
      
      if (providersResponse.data.google) {
        console.log('✅ Google provider configured');
      } else {
        console.log('❌ Google provider not configured');
      }
    } catch (error) {
      console.log('❌ NextAuth providers error:', error.response?.status, error.response?.statusText);
    }

    console.log('\n🎉 LOCAL AUTHENTICATION TEST COMPLETE!');
    console.log('=======================================');
    console.log('✅ Email/password authentication is working');
    console.log('✅ Registration and login APIs work');
    console.log('✅ Pages load correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Local server is not running. Please run:');
      console.log('npm run dev');
    }
  }
}

// Run the test
testLocalAuth().catch(console.error);
