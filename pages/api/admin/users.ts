import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { query } from '../../../src/lib/mysql'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  // Check if user is superadmin
  try {
    const [userRows] = await query('SELECT role FROM users WHERE id = ?', [parseInt(session.user.id)]) as any[]
    if (!userRows.length || userRows[0].role !== 'superadmin') {
      return res.status(403).json({ error: 'Superadmin access required' })
    }
  } catch (error) {
    console.error('Error checking user role:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }

  if (req.method === 'GET') {
    try {
      // Get all users with their usage data
      const users = await query(`
        SELECT 
          u.*,
          COUNT(r.id) as total_reports,
          COALESCE(SUM(r.cells_used), 0) as total_cells_generated
        FROM users u
        LEFT JOIN reports r ON u.id = r.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `)

      res.status(200).json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, password, role, subscription_plan } = req.body

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' })
      }

      // Check if email is already taken
      const [existingUsers] = await query('SELECT id FROM users WHERE email = ?', [email]) as any[]
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already taken' })
      }

      // Hash password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const [result] = await query(`
        INSERT INTO users (name, email, password, provider, role, subscription_plan, subscription_status, monthly_cells_used, monthly_reports_used, total_cells_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name,
        email.toLowerCase().trim(),
        hashedPassword,
        'credentials',
        role || 'user',
        subscription_plan || 'free',
        'active',
        0,
        0,
        0
      ]) as any

      // Get created user
      const [newUser] = await query('SELECT * FROM users WHERE id = ?', [result.insertId]) as any[]

      res.status(201).json(newUser[0])
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Failed to create user' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
