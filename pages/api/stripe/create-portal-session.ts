import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { createBillingPortalSession } from '../../../src/lib/stripe'
import UserMySQL from '../../../src/lib/models/UserMySQL'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Get user from database
    const user = await UserMySQL.findById(parseInt(session.user.id))
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' })
    }

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      user.stripe_customer_id,
      `${process.env.NEXTAUTH_URL}/dashboard`
    )

    res.status(200).json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session creation error:', error)
    res.status(500).json({ error: 'Failed to create portal session' })
  }
}
