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
  console.log('🔐 RESET PASSWORD API CALLED:', req.method)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, password } = req.body
    console.log('🔐 RESET PASSWORD DATA:', { token: token ? '***' : 'missing', password: password ? '***' : 'missing' })

    // Validation
    if (!token || !password) {
      console.log('❌ MISSING REQUIRED FIELDS')
      return res.status(400).json({ error: 'Token and password are required' })
    }

    if (password.length < 6) {
      console.log('❌ PASSWORD TOO SHORT')
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    console.log('🔌 CONNECTING TO DATABASE...')
    
    // Find user with valid reset token
    const connection = await mysql.createConnection(dbConfig)
    
    const [users] = await connection.execute(
      'SELECT id, email, reset_token_expiry FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    ) as any[]

    if (users.length === 0) {
      console.log('❌ INVALID OR EXPIRED TOKEN')
      await connection.end()
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    const user = users[0]
    console.log('✅ VALID TOKEN FOR USER:', user.email)

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await connection.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    )

    await connection.end()

    console.log('✅ PASSWORD RESET SUCCESSFUL')

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now log in with your new password.'
    })

  } catch (error: any) {
    console.error('❌ RESET PASSWORD ERROR:', error)
    return res.status(500).json({ error: 'Failed to reset password' })
  }
}
