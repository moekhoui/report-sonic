const mysql = require('mysql2/promise');

// Simple free MySQL database setup
// Using db4free.net (free MySQL hosting)
const dbConfig = {
  host: 'db4free.net',
  user: 'YOUR_DB4FREE_USERNAME', // Replace with your db4free username
  password: 'YOUR_DB4FREE_PASSWORD', // Replace with your db4free password
  database: 'YOUR_DB4FREE_DATABASE', // Replace with your db4free database name
  port: 3306,
  ssl: false,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

async function setupSimpleMySQLDatabase() {
  console.log('🚀 Setting up Simple MySQL Database...\n');
  
  console.log('📋 INSTRUCTIONS:');
  console.log('1. Go to https://www.db4free.net/');
  console.log('2. Sign up for a free account');
  console.log('3. Create a new database named "reportsonic_db"');
  console.log('4. Create a user "reportsonic_user" with password "ReportSonic2024!"');
  console.log('5. Grant all privileges to the user on the database');
  console.log('6. Run this script again\n');
  
  console.log('🔧 Configuration:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Username: ${dbConfig.user}`);
  console.log(`Password: ${dbConfig.password}\n`);
  
  try {
    // Test connection
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
    
    console.log('\n📋 Environment Variables to set in Vercel:');
    console.log('MYSQL_HOST=db4free.net');
    console.log('MYSQL_USER=reportsonic_user');
    console.log('MYSQL_PASSWORD=ReportSonic2024!');
    console.log('MYSQL_DATABASE=reportsonic_db');
    console.log('MYSQL_PORT=3306');
    
    console.log('\n🔐 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Create a db4free.net account');
    console.log('2. Create the database and user as specified above');
    console.log('3. Wait a few minutes for the database to be ready');
    console.log('4. Run this script again');
  }
}

setupSimpleMySQLDatabase();
