const mysql = require('mysql2/promise');

// PlanetScale free tier configuration
// You need to create a free account at https://planetscale.com/
const dbConfig = {
  host: 'aws.connect.psdb.cloud', // PlanetScale host
  user: 'YOUR_PLANETSCALE_USERNAME', // Replace with your PlanetScale username
  password: 'YOUR_PLANETSCALE_PASSWORD', // Replace with your PlanetScale password
  database: 'YOUR_DATABASE_NAME', // Replace with your database name
  port: 3306,
  ssl: {
    rejectUnauthorized: true
  },
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

async function setupPlanetScaleDatabase() {
  console.log('🚀 Setting up PlanetScale MySQL Database...\n');
  
  console.log('📋 INSTRUCTIONS:');
  console.log('1. Go to https://planetscale.com/');
  console.log('2. Sign up for a free account');
  console.log('3. Create a new database');
  console.log('4. Get your connection string');
  console.log('5. Update the credentials in this file');
  console.log('6. Run this script again\n');
  
  console.log('🔧 Current Configuration:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`Username: ${dbConfig.user}`);
  console.log(`Password: ${dbConfig.password ? '***' : 'Not set'}\n`);
  
  try {
    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to PlanetScale database');

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
    console.log('\n🎉 PlanetScale Database setup completed successfully!');
    
    console.log('\n📋 Environment Variables to set in Vercel:');
    console.log('MYSQL_HOST=aws.connect.psdb.cloud');
    console.log('MYSQL_USER=your_username');
    console.log('MYSQL_PASSWORD=your_password');
    console.log('MYSQL_DATABASE=your_database');
    console.log('MYSQL_PORT=3306');
    
    console.log('\n🔐 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Create a PlanetScale account');
    console.log('2. Create a database');
    console.log('3. Get your connection credentials');
    console.log('4. Update the configuration in this file');
  }
}

setupPlanetScaleDatabase();
