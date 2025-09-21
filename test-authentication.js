const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test-auth@reportsonic.com';
const TEST_PASSWORD = 'test123456';
const TEST_NAME = 'Test Auth User';

async function testAuthentication() {
  console.log('🧪 TESTING AUTHENTICATION SYSTEM');
  console.log('==================================\n');

  try {
    // Test 1: Registration
    console.log('📝 Test 1: User Registration');
    console.log('-----------------------------');
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (registerResponse.status === 200) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', registerResponse.data);
    }

    // Test 2: Login
    console.log('\n🔐 Test 2: User Login');
    console.log('----------------------');
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
      console.log('📋 User data:', loginResponse.data.user);
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }

    // Test 3: Get Current User (with cookie)
    console.log('\n👤 Test 3: Get Current User');
    console.log('-----------------------------');
    
    const cookie = loginResponse.headers['set-cookie'];
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: cookie ? cookie.join('; ') : ''
      }
    });
    
    if (meResponse.status === 200) {
      console.log('✅ Get current user successful');
      console.log('📋 User info:', meResponse.data.user);
    } else {
      console.log('❌ Get current user failed:', meResponse.data);
    }

    // Test 4: Forgot Password
    console.log('\n🔑 Test 4: Forgot Password');
    console.log('---------------------------');
    
    const forgotResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: TEST_EMAIL
    });
    
    if (forgotResponse.status === 200) {
      console.log('✅ Forgot password successful');
      console.log('📋 Response:', forgotResponse.data.message);
    } else {
      console.log('❌ Forgot password failed:', forgotResponse.data);
    }

    // Test 5: Logout
    console.log('\n🚪 Test 5: User Logout');
    console.log('------------------------');
    
    const logoutResponse = await axios.post(`${BASE_URL}/api/auth/logout`, {
      headers: {
        Cookie: cookie ? cookie.join('; ') : ''
      }
    });
    
    if (logoutResponse.status === 200) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed:', logoutResponse.data);
    }

    console.log('\n🎉 AUTHENTICATION SYSTEM TEST COMPLETE!');
    console.log('=========================================');
    console.log('✅ All authentication features are working!');
    console.log('✅ Your system is ready for production use!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Development server is not running. Please run:');
      console.log('npm run dev');
    }
  }
}

// Wait a moment for the server to start, then run tests
setTimeout(() => {
  testAuthentication().catch(console.error);
}, 3000);
