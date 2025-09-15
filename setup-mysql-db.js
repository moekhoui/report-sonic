const mysql = require('mysql2/promise');

// Free MySQL database configuration
// Using a free MySQL hosting service
const dbConfig = {
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12712345', // This will be provided by the hosting service
  password: 'your_password_here', // This will be provided by the hosting service
  database: 'sql12712345', // This will be provided by the hosting service
  port: 3306,
  ssl: false,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

async function setupMySQLDatabase() {
  console.log('🚀 Setting up MySQL Database...\n');
  
  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        image VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'credentials',
        subscription_plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
        subscription_status ENUM('active', 'canceled', 'past_due') DEFAULT 'active',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        current_period_end DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        data JSON,
        charts JSON,
        settings JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Reports table created');

    // Test insert a user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    await connection.execute(`
      INSERT IGNORE INTO users (email, name, password, provider) 
      VALUES (?, ?, ?, ?)
    `, ['test@example.com', 'Test User', hashedPassword, 'credentials']);
    
    console.log('✅ Test user created');

    // Test query
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    console.log('✅ Test query successful:', rows[0]);

    await connection.end();
    console.log('\n🎉 MySQL Database setup completed successfully!');
    
    console.log('\n📋 Database Configuration:');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`Database: ${dbConfig.database}`);
    console.log(`Port: ${dbConfig.port}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 To get free MySQL hosting:');
    console.log('1. Go to https://www.freemysqlhosting.net/');
    console.log('2. Create a free account');
    console.log('3. Create a new database');
    console.log('4. Update the credentials in this file');
    console.log('5. Run this script again');
  }
}

setupMySQLDatabase();
