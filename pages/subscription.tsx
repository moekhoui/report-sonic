import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PricingPlans } from '../src/components/PricingPlans'
import { UsageDisplay } from '../src/components/UsageDisplay'
import { SubscriptionPlan, UsageStats } from '../src/types'
import { calculateUsageStats } from '../src/utils/pricingCalculator'
import { STRIPE_PUBLISHABLE_KEY } from '../src/lib/stripe'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const user = await response.json()
        setUserData(user)
        
        // Calculate usage stats
        const plan = user.subscription_plan as SubscriptionPlan || 'free'
        const usageStats = calculateUsageStats(
          plan,
          user.monthly_cells_used || 0,
          user.monthly_reports_used || 0,
          user.total_cells_used || 0,
          new Date(user.last_reset_date || new Date())
        )
        setUsage(usageStats)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan === 'free') return

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        const stripe = await stripePromise
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create portal session')
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || !userData || !usage) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Subscription & Usage
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Manage your subscription and track your usage
          </p>
        </div>

        {/* Usage Display */}
        <div className="mb-12">
          <UsageDisplay
            usage={usage}
            plan={userData.subscription_plan as SubscriptionPlan || 'free'}
            onUpgrade={() => handleSelectPlan('starter')}
          />
        </div>

        {/* Billing Management */}
        {userData.subscription_plan !== 'free' && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Billing Management
              </h2>
              <p className="text-gray-600 mb-4">
                Manage your subscription, update payment methods, and view billing history.
              </p>
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Manage Billing
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div>
          <PricingPlans
            currentPlan={userData.subscription_plan as SubscriptionPlan || 'free'}
            onSelectPlan={handleSelectPlan}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
