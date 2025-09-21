const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'reportsonic',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupPasswordReset() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('📝 Adding password reset columns to users table...');
    
    // Add reset_token column
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL,
      ADD COLUMN IF NOT EXISTS reset_token_expiry DATETIME NULL
    `);
    
    console.log('✅ Password reset columns added successfully!');
    
    // Show the updated table structure
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('\n📋 Updated users table structure:');
    console.table(columns);
    
  } catch (error) {
    console.error('❌ Error setting up password reset:', error.message);
    
    if (error.code === 'ER_TABLE_EXISTS') {
      console.log('ℹ️  Table already exists, trying to add columns individually...');
      
      try {
        // Try to add columns individually
        await connection.execute('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL');
        await connection.execute('ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL');
        console.log('✅ Password reset columns added successfully!');
      } catch (addError) {
        if (addError.code === 'ER_DUP_FIELDNAME') {
          console.log('ℹ️  Password reset columns already exist!');
        } else {
          console.error('❌ Error adding columns:', addError.message);
        }
      }
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
setupPasswordReset().catch(console.error);
