import React, { useState } from 'react'
import { PRICING_PLANS, formatCurrency, getPlanDisplayName, SubscriptionPlan } from '../utils/pricingCalculator'

interface PricingPlansProps {
  currentPlan: SubscriptionPlan
  onSelectPlan: (plan: SubscriptionPlan) => void
  loading?: boolean
}

export function PricingPlans({ currentPlan, onSelectPlan, loading = false }: PricingPlansProps) {
  const [hoveredPlan, setHoveredPlan] = useState<SubscriptionPlan | null>(null)

  const plans = Object.entries(PRICING_PLANS) as [SubscriptionPlan, typeof PRICING_PLANS.free][]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Select the plan that fits your reporting needs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(([planKey, plan]) => {
          const isCurrentPlan = planKey === currentPlan
          const isPopular = planKey === 'starter'
          const isHovered = hoveredPlan === planKey

          return (
            <div
              key={planKey}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                isCurrentPlan
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : isPopular
                  ? 'border-yellow-400'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isHovered ? 'transform scale-105' : ''}`}
              onMouseEnter={() => setHoveredPlan(planKey)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {getPlanDisplayName(planKey)}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-lg text-gray-500">/month</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">
                      {plan.reportsPerMonth.toLocaleString()} reports per month
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">
                      {plan.cellsPerMonth.toLocaleString()} cells per month
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">
                      Up to {plan.maxCellsPerReport.toLocaleString()} cells per report
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">
                      Export: {plan.exportFormats.join(', ')}
                    </span>
                  </div>

                  {plan.whiteLabel && (
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-700">
                        White-label exports
                      </span>
                    </div>
                  )}

                  {'overageRate' in plan && plan.overageRate && (
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-700">
                        Overage: {formatCurrency((plan as any).overageRate)} per 10K cells
                      </span>
                    </div>
                  )}
                  </>
                </div>

                <div className="mt-8">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPlan(planKey)}
                      disabled={loading}
                      className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors ${
                        isPopular
                          ? 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                          : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {planKey === 'free' ? 'Current Plan' : 'Upgrade to ' + getPlanDisplayName(planKey)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          All plans include unlimited support and regular updates. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
