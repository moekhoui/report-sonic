import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: { rejectUnauthorized: false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    console.log('🔐 LOGIN ATTEMPT:', email)

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)

    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[]

    await connection.end()

    if (users.length === 0) {
      console.log('❌ User not found:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    console.log('✅ LOGIN SUCCESS:', user.email)

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      }
    })

  } catch (error: any) {
    console.error('❌ LOGIN ERROR:', error)
    return res.status(500).json({ error: 'Login failed' })
  }
}
