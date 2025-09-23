import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { createCheckoutSession, getPriceId, createCustomer } from '../../../src/lib/stripe'
import UserMySQL from '../../../src/lib/models/UserMySQL'
import { SubscriptionPlan } from '../../../src/utils/pricingCalculator'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { plan } = req.body
    if (!plan || !['starter', 'professional'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    // Get user from database
    const user = await UserMySQL.findById(parseInt(session.user.id))
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    let customerId = user.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer(user.email, user.name)
      customerId = customer.id
      
      // Update user with customer ID
      await UserMySQL.update(user.id!, { stripe_customer_id: customerId })
    }

    // Create checkout session
    const priceId = getPriceId(plan as SubscriptionPlan)
    
    // Validate price ID exists
    if (!priceId) {
      console.error('Price ID not found for plan:', plan)
      return res.status(400).json({ error: 'Price ID not configured for this plan' })
    }

    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`
    )

    res.status(200).json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
