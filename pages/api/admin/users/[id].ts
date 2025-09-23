import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { query } from '../../../../src/lib/mysql'

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

  const { id } = req.query
  const userId = parseInt(id as string)

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  if (req.method === 'GET') {
    try {
      const [userRows] = await query('SELECT * FROM users WHERE id = ?', [userId]) as any[]
      
      if (!userRows.length) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Get user's reports
      const reports = await query(`
        SELECT id, title, cells_used, created_at 
        FROM reports 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `, [userId])

      // Get user's usage logs
      const usageLogs = await query(`
        SELECT * FROM usage_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
      `, [userId])

      res.status(200).json({
        user: userRows[0],
        reports,
        usageLogs
      })
    } catch (error) {
      console.error('Error fetching user details:', error)
      res.status(500).json({ error: 'Failed to fetch user details' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, email, role, subscription_plan, monthly_reports_used, monthly_cells_used } = req.body

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' })
      }

      // Check if email is already taken by another user
      const [existingUsers] = await query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]) as any[]
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already taken by another user' })
      }

      // Update user
      await query(`
        UPDATE users 
        SET name = ?, email = ?, role = ?, subscription_plan = ?, monthly_reports_used = ?, monthly_cells_used = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, email, role || 'user', subscription_plan || 'free', monthly_reports_used || 0, monthly_cells_used || 0, userId])

      // Get updated user
      const [updatedUser] = await query('SELECT * FROM users WHERE id = ?', [userId]) as any[]

      res.status(200).json(updatedUser[0])
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete user and all related data (cascade)
      await query('DELETE FROM users WHERE id = ?', [userId])

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Failed to delete user' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
