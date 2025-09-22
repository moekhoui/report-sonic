import { NextApiRequest, NextApiResponse } from 'next'
import { constructWebhookEvent } from '../../../src/lib/stripe'
import UserMySQL from '../../../src/lib/models/UserMySQL'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const signature = req.headers['stripe-signature'] as string
    const event = constructWebhookEvent(req.body, signature, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: 'Webhook error' })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)
  
  if (session.subscription) {
    const subscription = await constructWebhookEvent(
      session.subscription as any,
      '',
      process.env.STRIPE_SECRET_KEY!
    )
    await handleSubscriptionUpdated(subscription.data.object as Stripe.Subscription)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  // Find user by customer ID
  const users = await UserMySQL.findAll()
  const user = users.find(u => u.stripe_customer_id === subscription.customer as string)
  
  if (!user) {
    console.error('User not found for subscription:', subscription.id)
    return
  }

  // Determine plan from price ID
  let plan: 'free' | 'starter' | 'professional' = 'free'
  const priceId = subscription.items.data[0]?.price.id
  
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    plan = 'starter'
  } else if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
    plan = 'professional'
  }

  // Update user subscription
  await UserMySQL.update(user.id!, {
    subscription_plan: plan,
    subscription_status: subscription.status === 'active' ? 'active' : 'canceled',
    stripe_subscription_id: subscription.id,
    current_period_end: new Date(subscription.current_period_end * 1000)
  })

  console.log(`Updated user ${user.email} to plan ${plan}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  // Find user by customer ID
  const users = await UserMySQL.findAll()
  const user = users.find(u => u.stripe_customer_id === subscription.customer as string)
  
  if (!user) {
    console.error('User not found for subscription:', subscription.id)
    return
  }

  // Downgrade to free plan
  await UserMySQL.update(user.id!, {
    subscription_plan: 'free',
    subscription_status: 'canceled',
    stripe_subscription_id: null,
    current_period_end: null
  })

  console.log(`Downgraded user ${user.email} to free plan`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded for invoice:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await constructWebhookEvent(
      invoice.subscription as any,
      '',
      process.env.STRIPE_SECRET_KEY!
    )
    await handleSubscriptionUpdated(subscription.data.object as Stripe.Subscription)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id)
  
  // Find user by customer ID
  const users = await UserMySQL.findAll()
  const user = users.find(u => u.stripe_customer_id === invoice.customer as string)
  
  if (!user) {
    console.error('User not found for invoice:', invoice.id)
    return
  }

  // Update subscription status to past_due
  await UserMySQL.update(user.id!, {
    subscription_status: 'past_due'
  })

  console.log(`Updated user ${user.email} subscription to past_due`)
}
