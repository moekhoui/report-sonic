const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'reportsonic',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
};

async function createYourSuperAdmin() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Your account details
    const email = 'khouildi.my@gmail.com';
    const name = 'Khouildi (Super Admin)';
    const password = 'Zidane1996@@';
    
    console.log('🔍 Checking for existing user...');
    
    // Check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      console.log('⚠️  User already exists, deleting...');
      // Delete existing user and all related data
      await connection.execute('DELETE FROM users WHERE email = ?', [email]);
      console.log('✅ Existing user deleted');
    }
    
    console.log('🔐 Creating superadmin account...');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${name}`);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert superadmin
    const [result] = await connection.execute(`
      INSERT INTO users (email, name, password, provider, role, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [email, name, hashedPassword, 'credentials', 'superadmin', 'professional', 'active']);
    
    console.log('✅ Superadmin created successfully!');
    console.log(`   User ID: ${result.insertId}`);
    console.log('\n🎯 You can now login with these credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Admin panel: /admin/users');
    console.log('🔗 Dashboard: /dashboard');
    
  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
    
    if (error.code === 'ER_TABLE_DOESNT_EXIST') {
      console.log('\n💡 Database tables not found. Please run the application first to create the tables.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Please check your database credentials.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run the script
createYourSuperAdmin().catch(console.error);
