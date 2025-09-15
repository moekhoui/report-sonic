const mysql = require('mysql2/promise');

// Aiven MySQL configuration
// Use environment variables for security
const dbConfig = {
  host: process.env.MYSQL_HOST || 'reportsonic-mysql-report-sonic.g.aivencloud.com',
  user: process.env.MYSQL_USER || 'avnadmin',
  password: process.env.MYSQL_PASSWORD || 'YOUR_AIVEN_PASSWORD',
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  port: parseInt(process.env.MYSQL_PORT || '14183'),
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

async function setupAivenDatabase() {
  console.log('🚀 Setting up Aiven MySQL Database...\n');
  
  console.log('📋 INSTRUCTIONS:');
  console.log('1. Go to https://console.aiven.io/');
  console.log('2. Sign up for a free account');
  console.log('3. Create a new MySQL service');
  console.log('4. Get your connection details from the Overview tab');
  console.log('5. Update the credentials in this file');
  console.log('6. Run this script again\n');
  
  console.log('🔧 Current Configuration:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Username: ${dbConfig.user}`);
  console.log(`Password: ${dbConfig.password ? '***' : 'Not set'}`);
  console.log(`Port: ${dbConfig.port}\n`);
  
  try {
    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to Aiven MySQL database');

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
    console.log('\n🎉 Aiven Database setup completed successfully!');
    
    console.log('\n📋 Environment Variables to set in Vercel:');
    console.log(`MYSQL_HOST=${dbConfig.host}`);
    console.log(`MYSQL_USER=${dbConfig.user}`);
    console.log(`MYSQL_PASSWORD=${dbConfig.password}`);
    console.log(`MYSQL_DATABASE=${dbConfig.database}`);
    console.log(`MYSQL_PORT=${dbConfig.port}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Create an Aiven account');
    console.log('2. Create a MySQL service');
    console.log('3. Get your connection credentials from the Overview tab');
    console.log('4. Update the configuration in this file');
    console.log('5. Wait for the service to be fully ready (2-3 minutes)');
  }
}

setupAivenDatabase();
