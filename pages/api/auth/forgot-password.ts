import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

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
  console.log('🔐 FORGOT PASSWORD API CALLED:', req.method)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body
    console.log('🔐 FORGOT PASSWORD EMAIL:', email)

    // Validation
    if (!email) {
      console.log('❌ MISSING EMAIL')
      return res.status(400).json({ error: 'Email is required' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ INVALID EMAIL FORMAT')
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    console.log('🔌 CONNECTING TO DATABASE...')
    
    // Check if user exists
    const normalizedEmail = email.toLowerCase().trim()
    const connection = await mysql.createConnection(dbConfig)
    
    const [users] = await connection.execute(
      'SELECT id, email, name FROM users WHERE email = ?',
      [normalizedEmail]
    ) as any[]

    await connection.end()

    if (users.length === 0) {
      console.log('❌ USER NOT FOUND')
      // For security, we don't reveal if the email exists or not
      return res.status(200).json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      })
    }

    const user = users[0]
    console.log('✅ USER FOUND:', user.email)

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    const connection2 = await mysql.createConnection(dbConfig)
    await connection2.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    )
    await connection2.end()

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
    console.log('🔗 RESET LINK:', resetLink)

    console.log('✅ PASSWORD RESET EMAIL SENT (simulated)')

    return res.status(200).json({
      message: 'If an account with that email exists, we have sent a password reset link.',
      resetLink // Only for development - remove in production
    })

  } catch (error: any) {
    console.error('❌ FORGOT PASSWORD ERROR:', error)
    return res.status(500).json({ error: 'Failed to process password reset request' })
  }
}
