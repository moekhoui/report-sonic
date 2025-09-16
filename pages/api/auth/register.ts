import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: {
    rejectUnauthorized: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📝 REGISTRATION API CALLED:', req.method)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body
    console.log('📝 REGISTRATION DATA:', { name, email, password: password ? '***' : 'missing' })

    // Validation
    if (!name || !email || !password) {
      console.log('❌ MISSING REQUIRED FIELDS')
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      console.log('❌ PASSWORD TOO SHORT')
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ INVALID EMAIL FORMAT')
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    console.log('🔌 CONNECTING TO DATABASE...')
    
    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim()
    console.log('🔍 CHECKING FOR EXISTING USER:', normalizedEmail)
    
    const connection = await mysql.createConnection(dbConfig)
    const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [normalizedEmail]) as any[]
    console.log('👤 EXISTING USER FOUND:', existingUsers.length > 0 ? 'Yes' : 'No')
    
    if (existingUsers.length > 0) {
      console.log('❌ USER ALREADY EXISTS')
      await connection.end()
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Create user
    console.log('👤 CREATING NEW USER...')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const [result] = await connection.execute(`
      INSERT INTO users (email, name, password, provider, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [normalizedEmail, name.trim(), hashedPassword, 'credentials', 'free', 'active'])
    
    await connection.end()
    console.log('✅ USER CREATED SUCCESSFULLY WITH ID:', result.insertId)

    return res.status(201).json({ 
      message: 'Account created successfully! Welcome to ReportSonic!', 
      userId: result.insertId,
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
      }
    })
  } catch (error: any) {
    console.error('❌ REGISTRATION ERROR:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'User already exists with this email' })
    }
    
    return res.status(500).json({ error: 'Failed to create account. Please try again.' })
  }
}
