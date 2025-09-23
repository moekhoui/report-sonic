import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'reportsonic',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export async function getConnection() {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log('✅ MySQL connection pool created');
    } catch (error) {
      console.error('❌ MySQL connection error:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
  return pool;
}

export async function query(sql: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ MySQL query error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔌 MySQL connection closed');
  }
}

// Initialize database tables
export async function initDatabase() {
  try {
    const connection = await getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        image VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'credentials',
        role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
        subscription_plan ENUM('free', 'starter', 'professional') DEFAULT 'free',
        subscription_status ENUM('active', 'canceled', 'past_due') DEFAULT 'active',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        current_period_end DATETIME,
        monthly_cells_used INT DEFAULT 0,
        monthly_reports_used INT DEFAULT 0,
        total_cells_used INT DEFAULT 0,
        last_reset_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add role column if it doesn't exist (for existing databases)
    try {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN role ENUM('user', 'admin', 'superadmin') DEFAULT 'user'
      `);
    } catch (error) {
      // Column already exists, ignore error
      console.log('Role column already exists or error adding it:', error);
    }

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
        cells_used INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create usage_logs table for analytics
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        report_id INT,
        action_type ENUM('report_generated', 'cells_used', 'limit_reached') NOT NULL,
        cells_used INT DEFAULT 0,
        reports_used INT DEFAULT 0,
        details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export default { getConnection, query, closeConnection, initDatabase };
