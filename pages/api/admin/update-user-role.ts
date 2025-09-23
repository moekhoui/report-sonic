import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../src/lib/auth'
import { query } from '../../src/lib/mysql'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    // For now, allow this endpoint to be called without authentication
    // In production, you might want to add additional security
    
    const { email, role, subscription_plan } = req.body

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' })
    }

    // Check if user exists
    const [users] = await query('SELECT id, name, email FROM users WHERE email = ?', [email]) as any[]
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = users[0]
    console.log(`Updating user: ${user.name} (${user.email}) to role: ${role}`)

    // Update user role and subscription plan
    await query(
      'UPDATE users SET role = ?, subscription_plan = ?, subscription_status = ? WHERE email = ?',
      [role, subscription_plan || 'professional', 'active', email]
    )

    // Get updated user data
    const [updatedUsers] = await query('SELECT * FROM users WHERE email = ?', [email]) as any[]

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUsers[0]
    })

  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
