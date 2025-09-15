const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000'; // Change this to your Vercel URL when testing live

async function testAPIEndpoints() {
  console.log('🚀 Testing API Endpoints...\n');
  
  try {
    // Test 1: Registration API
    console.log('1️⃣ Testing Registration API...');
    const registrationData = {
      name: 'API Test User',
      email: 'apitest@example.com',
      password: 'password123'
    };
    
    const registrationResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registrationResult = await registrationResponse.json();
    
    if (registrationResponse.ok) {
      console.log('✅ Registration API: SUCCESS');
      console.log('📋 Response:', registrationResult);
    } else {
      console.log('❌ Registration API: FAILED');
      console.log('📋 Error:', registrationResult);
    }
    
    console.log('');
    
    // Test 2: Test with duplicate email
    console.log('2️⃣ Testing duplicate email prevention...');
    const duplicateResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const duplicateResult = await duplicateResponse.json();
    
    if (!duplicateResponse.ok && duplicateResult.error.includes('already exists')) {
      console.log('✅ Duplicate prevention: SUCCESS');
      console.log('📋 Response:', duplicateResult);
    } else {
      console.log('❌ Duplicate prevention: FAILED');
      console.log('📋 Response:', duplicateResult);
    }
    
    console.log('');
    
    // Test 3: Test with invalid data
    console.log('3️⃣ Testing invalid data validation...');
    const invalidData = {
      name: 'Test',
      email: 'invalid-email',
      password: '123'
    };
    
    const invalidResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData)
    });
    
    const invalidResult = await invalidResponse.json();
    
    if (!invalidResponse.ok) {
      console.log('✅ Validation: SUCCESS (correctly rejected invalid data)');
      console.log('📋 Response:', invalidResult);
    } else {
      console.log('❌ Validation: FAILED (should have rejected invalid data)');
      console.log('📋 Response:', invalidResult);
    }
    
    console.log('\n🎉 API Endpoint Tests Completed!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    console.log('\n💡 Note: Make sure your development server is running on localhost:3000');
    console.log('   Or update the BASE_URL to your Vercel deployment URL');
  }
}

testAPIEndpoints();
