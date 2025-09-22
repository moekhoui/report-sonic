import React from 'react'
import { UsageStats, SubscriptionPlan } from '../types'
import { getPricingLimits, formatCurrency, getPlanDisplayName } from '../utils/pricingCalculator'

interface UsageDisplayProps {
  usage: UsageStats
  plan: SubscriptionPlan
  onUpgrade?: () => void
}

export function UsageDisplay({ usage, plan, onUpgrade }: UsageDisplayProps) {
  const limits = getPricingLimits(plan)
  const cellsPercentage = (usage.monthlyCellsUsed / limits.cellsPerMonth) * 100
  const reportsPercentage = (usage.monthlyReportsUsed / limits.reportsPerMonth) * 100

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Usage Overview
        </h2>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {getPlanDisplayName(plan)}
          </span>
          {plan !== 'professional' && onUpgrade && (
            <button
              onClick={onUpgrade}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Reports Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Reports This Month</span>
            <span className="text-sm text-gray-500">
              {usage.monthlyReportsUsed.toLocaleString()} / {limits.reportsPerMonth.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(reportsPercentage)}`}
              style={{ width: `${Math.min(reportsPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {usage.reportsRemaining.toLocaleString()} remaining
            </span>
            <span className="text-xs text-gray-500">
              {reportsPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Cells Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Cells This Month</span>
            <span className="text-sm text-gray-500">
              {usage.monthlyCellsUsed.toLocaleString()} / {limits.cellsPerMonth.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(cellsPercentage)}`}
              style={{ width: `${Math.min(cellsPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {usage.cellsRemaining.toLocaleString()} remaining
            </span>
            <span className="text-xs text-gray-500">
              {cellsPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Current Plan Benefits</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {limits.reportsPerMonth.toLocaleString()} reports per month</li>
            <li>• {limits.cellsPerMonth.toLocaleString()} cells per month</li>
            <li>• Up to {limits.maxCellsPerReport.toLocaleString()} cells per report</li>
            <li>• Export formats: {limits.exportFormats.join(', ')}</li>
            {limits.whiteLabel && <li>• White-label exports</li>}
            {limits.overageRate && (
              <li>• Overage: {formatCurrency(limits.overageRate)} per 10K cells</li>
            )}
          </ul>
        </div>

        {/* Total Usage */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Cells Used</span>
            <span className="text-sm font-medium text-gray-900">
              {usage.totalCellsUsed.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Since account creation
          </div>
        </div>
      </div>
    </div>
  )
}
