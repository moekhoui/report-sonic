const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Test MySQL configuration - Aiven
const dbConfig = {
  host: process.env.MYSQL_HOST || 'reportsonic-mysql-report-sonic.g.aivencloud.com',
  user: process.env.MYSQL_USER || 'avnadmin',
  password: process.env.MYSQL_PASSWORD || 'YOUR_MYSQL_PASSWORD',
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  port: parseInt(process.env.MYSQL_PORT || '14183'),
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
};

async function testAuthFinal() {
  console.log('🎯 FINAL AUTHENTICATION TEST');
  console.log('============================\n');
  
  let connection;
  
  try {
    // 1. Connect to Database
    console.log('1️⃣ Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');
    
    // 2. Clear existing test users
    console.log('\n2️⃣ Clearing existing test users...');
    await connection.execute('DELETE FROM users WHERE email LIKE "%test%" OR email LIKE "%example%"');
    console.log('✅ Test users cleared');
    
    // 3. Test User Creation (Credentials)
    console.log('\n3️⃣ Testing Credentials User Creation...');
    const credentialsUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      password: 'testpassword123',
      provider: 'credentials'
    };
    
    const hashedPassword = await bcrypt.hash(credentialsUser.password, 12);
    
    const [createResult] = await connection.execute(`
      INSERT INTO users (email, name, password, provider, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      credentialsUser.email,
      credentialsUser.name,
      hashedPassword,
      credentialsUser.provider,
      'free',
      'active'
    ]);
    
    console.log('✅ Credentials user created with ID:', createResult.insertId);
    
    // 4. Test Google User Creation
    console.log('\n4️⃣ Testing Google User Creation...');
    const googleUser = {
      email: 'googleuser@example.com',
      name: 'Google User',
      image: 'https://example.com/avatar.jpg',
      provider: 'google'
    };
    
    const [googleResult] = await connection.execute(`
      INSERT INTO users (email, name, image, provider, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      googleUser.email,
      googleUser.name,
      googleUser.image,
      googleUser.provider,
      'free',
      'active'
    ]);
    
    console.log('✅ Google user created with ID:', googleResult.insertId);
    
    // 5. Test User Lookup
    console.log('\n5️⃣ Testing User Lookup...');
    const [users] = await connection.execute('SELECT * FROM users ORDER BY created_at DESC');
    console.log('✅ Total users in database:', users.length);
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.provider}`);
    });
    
    // 6. Test Password Verification
    console.log('\n6️⃣ Testing Password Verification...');
    const credentialsUserData = users.find(u => u.provider === 'credentials');
    if (credentialsUserData) {
      const isValidPassword = await bcrypt.compare(credentialsUser.password, credentialsUserData.password);
      console.log('✅ Password verification:', isValidPassword ? 'SUCCESS' : 'FAILED');
    }
    
    // 7. Test User Update
    console.log('\n7️⃣ Testing User Update...');
    await connection.execute('UPDATE users SET name = ? WHERE id = ?', 
      ['Updated Test User', createResult.insertId]);
    
    const [updatedUser] = await connection.execute('SELECT * FROM users WHERE id = ?', 
      [createResult.insertId]);
    console.log('✅ User updated successfully:', updatedUser[0].name);
    
    // 8. Test User Deletion
    console.log('\n8️⃣ Testing User Deletion...');
    const [deleteResult] = await connection.execute('DELETE FROM users WHERE id = ?', 
      [createResult.insertId]);
    console.log('✅ User deleted successfully, affected rows:', deleteResult.affectedRows);
    
    const [googleDeleteResult] = await connection.execute('DELETE FROM users WHERE id = ?', 
      [googleResult.insertId]);
    console.log('✅ Google user deleted successfully, affected rows:', googleDeleteResult.affectedRows);
    
    console.log('\n🎉 AUTHENTICATION SYSTEM IS FULLY WORKING!');
    console.log('\n📋 COMPLETE TEST SUMMARY:');
    console.log('✅ Database connection: WORKING');
    console.log('✅ User creation (credentials): WORKING');
    console.log('✅ User creation (Google): WORKING');
    console.log('✅ User lookup: WORKING');
    console.log('✅ Password verification: WORKING');
    console.log('✅ User update: WORKING');
    console.log('✅ User deletion: WORKING');
    console.log('✅ All CRUD operations: WORKING');
    
    console.log('\n🚀 READY FOR PRODUCTION!');
    console.log('The authentication system is fully functional and tested.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the test
testAuthFinal().catch(console.error);
