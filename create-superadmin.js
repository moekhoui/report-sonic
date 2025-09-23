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

async function createSuperAdmin() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Check if superadmin already exists
    const [existingAdmins] = await connection.execute(
      'SELECT id, email FROM users WHERE role = ?',
      ['superadmin']
    );
    
    if (existingAdmins.length > 0) {
      console.log('⚠️  Superadmin already exists:');
      existingAdmins.forEach(admin => {
        console.log(`   - ID: ${admin.id}, Email: ${admin.email}`);
      });
      console.log('\n💡 If you want to create a new superadmin, please delete the existing one first.');
      return;
    }
    
    // Create superadmin credentials
    const email = 'admin@reportsonic.com';
    const name = 'Super Admin';
    const password = 'SuperAdmin123!';
    
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
createSuperAdmin().catch(console.error);
