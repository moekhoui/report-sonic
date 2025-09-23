import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: { rejectUnauthorized: false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get token from cookie
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any

    // Get fresh user data from database
    const connection = await mysql.createConnection(dbConfig)
    const [users] = await connection.execute(
      'SELECT id, email, name, image, role, subscription_plan, subscription_status FROM users WHERE id = ?',
      [decoded.id]
    ) as any[]
    await connection.end()

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }

    const user = users[0]

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role || 'user',
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status
      }
    })

  } catch (error: any) {
    console.error('❌ ME ERROR:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
