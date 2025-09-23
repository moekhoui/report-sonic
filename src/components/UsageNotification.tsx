import React from 'react'
import { UsageStats } from '../types'
import { SubscriptionPlan } from '../utils/pricingCalculator'
import { getPricingLimits } from '../utils/pricingCalculator'

interface UsageNotificationProps {
  usage: UsageStats
  plan: SubscriptionPlan
  onUpgrade?: () => void
  onDismiss?: () => void
}

export function UsageNotification({ usage, plan, onUpgrade, onDismiss }: UsageNotificationProps) {
  const limits = getPricingLimits(plan)
  const cellsPercentage = (usage.monthlyCellsUsed / limits.cellsPerMonth) * 100
  const reportsPercentage = (usage.monthlyReportsUsed / limits.reportsPerMonth) * 100

  // Only show notification if usage is above 80%
  if (cellsPercentage < 80 && reportsPercentage < 80) {
    return null
  }

  const getNotificationType = () => {
    if (cellsPercentage >= 100 || reportsPercentage >= 100) {
      return 'error'
    } else if (cellsPercentage >= 90 || reportsPercentage >= 90) {
      return 'warning'
    } else {
      return 'info'
    }
  }

  const notificationType = getNotificationType()

  const getNotificationConfig = () => {
    switch (notificationType) {
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Usage Limit Reached',
          message: 'You have reached your monthly usage limit. Upgrade to continue generating reports.'
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Approaching Usage Limit',
          message: 'You are approaching your monthly usage limit. Consider upgrading to avoid interruptions.'
        }
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Usage Update',
          message: 'You are using most of your monthly quota. Consider upgrading for more capacity.'
        }
    }
  }

  const config = getNotificationConfig()

  return (
    <div className={`rounded-md ${config.bgColor} ${config.borderColor} border p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className={`${config.iconColor}`}>
            {config.icon}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.titleColor}`}>
            {config.title}
          </h3>
          <div className={`mt-2 text-sm ${config.textColor}`}>
            <p>{config.message}</p>
            <div className="mt-2 space-y-1">
              <p>Reports: {usage.monthlyReportsUsed.toLocaleString()} / {limits.reportsPerMonth.toLocaleString()} ({reportsPercentage.toFixed(1)}%)</p>
              <p>Cells: {usage.monthlyCellsUsed.toLocaleString()} / {limits.cellsPerMonth.toLocaleString()} ({cellsPercentage.toFixed(1)}%)</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              {onUpgrade && plan !== 'professional' && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  className={`${config.bgColor} ${config.titleColor} rounded-md px-2 py-1.5 text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600`}
                >
                  Upgrade Plan
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`ml-3 ${config.bgColor} ${config.titleColor} rounded-md px-2 py-1.5 text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600`}
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
