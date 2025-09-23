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
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
