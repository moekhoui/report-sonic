import Stripe from 'stripe'
import { SubscriptionPlan } from '../utils/pricingCalculator'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

// Stripe price IDs for each plan (you'll need to create these in your Stripe dashboard)
const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
} as const

export async function createCustomer(email: string, name: string): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'reportsonic'
    }
  })
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      source: 'reportsonic'
    }
  })
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  })
}

export function getPriceId(plan: SubscriptionPlan): string {
  if (plan === 'free') {
    throw new Error('Free plan does not have a price ID')
  }
  return PRICE_IDS[plan]
}

export async function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(body, signature, secret)
}

export { stripe }
