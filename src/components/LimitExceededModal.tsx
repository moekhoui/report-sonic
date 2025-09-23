import React from 'react'
import { SubscriptionPlan } from '../utils/pricingCalculator'
import { getPlanDisplayName, PRICING_PLANS } from '../utils/pricingCalculator'

interface LimitExceededModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
  errors: string[]
  currentPlan: SubscriptionPlan
  cellsUsed: number
}

export function LimitExceededModal({
  isOpen,
  onClose,
  onUpgrade,
  errors,
  currentPlan,
  cellsUsed
}: LimitExceededModalProps) {
  if (!isOpen) return null

  const nextPlan = currentPlan === 'free' ? 'starter' : 'professional'
  const nextPlanData = PRICING_PLANS[nextPlan]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Usage Limit Exceeded
          </h3>
          
          <div className="mt-2 px-7 py-3">
            <div className="text-sm text-gray-500 mb-4">
              {errors.map((error, index) => (
                <p key={index} className="mb-1">{error}</p>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Upgrade to {getPlanDisplayName(nextPlan)}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {nextPlanData.reportsPerMonth.toLocaleString()} reports per month</p>
                <p>• {nextPlanData.cellsPerMonth.toLocaleString()} cells per month</p>
                <p>• Up to {nextPlanData.maxCellsPerReport.toLocaleString()} cells per report</p>
                <p>• Export formats: {nextPlanData.exportFormats.join(', ')}</p>
                {nextPlanData.whiteLabel && <p>• White-label exports</p>}
              </div>
              <div className="mt-2 text-lg font-semibold text-blue-900">
                ${nextPlanData.price}/month
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Maybe Later
              </button>
              <button
                onClick={onUpgrade}
                className="flex-1 bg-blue-600 border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
