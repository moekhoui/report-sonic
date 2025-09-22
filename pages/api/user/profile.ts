import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import UserMySQL from '../../../src/lib/models/UserMySQL'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const user = await UserMySQL.findById(parseInt(session.user.id))
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return user data without sensitive information
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      subscription_plan: user.subscription_plan,
      subscription_status: user.subscription_status,
      monthly_cells_used: user.monthly_cells_used || 0,
      monthly_reports_used: user.monthly_reports_used || 0,
      total_cells_used: user.total_cells_used || 0,
      last_reset_date: user.last_reset_date,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    res.status(200).json(userProfile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
