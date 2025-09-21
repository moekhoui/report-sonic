const mysql = require('mysql2/promise');

// Default database configuration - update these values
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'reportsonic',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    console.log('📋 Using config:', { ...dbConfig, password: '***' });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    
    if (tables.length === 0) {
      console.log('📝 Creating users table...');
      await connection.execute(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NULL,
          image VARCHAR(500) NULL,
          provider VARCHAR(50) DEFAULT 'credentials',
          subscription_plan VARCHAR(50) DEFAULT 'free',
          subscription_status VARCHAR(50) DEFAULT 'active',
          reset_token VARCHAR(255) NULL,
          reset_token_expiry DATETIME NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists');
      
      // Check if password reset columns exist
      const [columns] = await connection.execute('SHOW COLUMNS FROM users LIKE "reset_token"');
      
      if (columns.length === 0) {
        console.log('📝 Adding password reset columns...');
        await connection.execute('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL');
        await connection.execute('ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL');
        console.log('✅ Password reset columns added successfully!');
      } else {
        console.log('✅ Password reset columns already exist');
      }
    }
    
    // Show table structure
    const [tableStructure] = await connection.execute('DESCRIBE users');
    console.log('\n📋 Users table structure:');
    console.table(tableStructure);
    
    // Create a test user if none exists
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      console.log('\n👤 Creating test user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('test123456', 12);
      
      await connection.execute(`
        INSERT INTO users (email, name, password, provider, subscription_plan, subscription_status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['test@reportsonic.com', 'Test User', hashedPassword, 'credentials', 'free', 'active']);
      
      console.log('✅ Test user created: test@reportsonic.com / test123456');
    } else {
      console.log('\n👤 Users already exist in database');
    }
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database connection failed. Please:');
      console.log('1. Make sure MySQL is running');
      console.log('2. Update the database credentials in setup-database-simple.js');
      console.log('3. Create the "reportsonic" database if it doesn\'t exist');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database "reportsonic" does not exist. Please create it first:');
      console.log('CREATE DATABASE reportsonic;');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the setup
setupDatabase().catch(console.error);
