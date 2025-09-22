import { PricingLimits, UsageStats } from '../types'

export const PRICING_PLANS = {
  free: {
    reportsPerMonth: 5,
    cellsPerMonth: 100000,
    maxCellsPerReport: 10000,
    exportFormats: ['pdf'],
    whiteLabel: false,
    price: 0
  },
  starter: {
    reportsPerMonth: 25,
    cellsPerMonth: 500000,
    maxCellsPerReport: 50000,
    exportFormats: ['pdf', 'docx', 'xlsx'],
    whiteLabel: false,
    price: 9
  },
  professional: {
    reportsPerMonth: 100,
    cellsPerMonth: 2000000,
    maxCellsPerReport: 200000,
    exportFormats: ['pdf', 'docx', 'xlsx'],
    whiteLabel: true,
    overageRate: 0.10, // $0.10 per 10,000 cells
    price: 29
  }
} as const

export type SubscriptionPlan = keyof typeof PRICING_PLANS

export function calculateCells(fileData: any): number {
  if (!fileData || !Array.isArray(fileData)) {
    return 0
  }
  
  // Calculate cells = rows × columns (including headers)
  const rows = fileData.length
  const columns = fileData.length > 0 ? Object.keys(fileData[0]).length : 0
  
  return rows * columns
}

export function getPricingLimits(plan: SubscriptionPlan): PricingLimits {
  const planData = PRICING_PLANS[plan]
  return {
    reportsPerMonth: planData.reportsPerMonth,
    cellsPerMonth: planData.cellsPerMonth,
    maxCellsPerReport: planData.maxCellsPerReport,
    exportFormats: planData.exportFormats,
    whiteLabel: planData.whiteLabel,
    overageRate: planData.overageRate
  }
}

export function calculateUsageStats(
  plan: SubscriptionPlan,
  monthlyCellsUsed: number,
  monthlyReportsUsed: number,
  totalCellsUsed: number,
  lastResetDate: Date
): UsageStats {
  const limits = getPricingLimits(plan)
  
  return {
    monthlyCellsUsed,
    monthlyReportsUsed,
    totalCellsUsed,
    cellsRemaining: Math.max(0, limits.cellsPerMonth - monthlyCellsUsed),
    reportsRemaining: Math.max(0, limits.reportsPerMonth - monthlyReportsUsed),
    lastResetDate
  }
}

export function checkLimits(
  plan: SubscriptionPlan,
  monthlyCellsUsed: number,
  monthlyReportsUsed: number,
  fileData: any
): { allowed: boolean; errors: string[] } {
  const limits = getPricingLimits(plan)
  const cellsNeeded = calculateCells(fileData)
  const errors: string[] = []
  
  // Check report count limit
  if (monthlyReportsUsed >= limits.reportsPerMonth) {
    errors.push(`You've reached your monthly report limit of ${limits.reportsPerMonth} reports.`)
  }
  
  // Check cells per report limit
  if (cellsNeeded > limits.maxCellsPerReport) {
    errors.push(`This file exceeds the maximum ${limits.maxCellsPerReport.toLocaleString()} cells per report limit.`)
  }
  
  // Check monthly cell quota
  if (monthlyCellsUsed + cellsNeeded > limits.cellsPerMonth) {
    const remainingCells = limits.cellsPerMonth - monthlyCellsUsed
    errors.push(`This would exceed your monthly cell quota. You have ${remainingCells.toLocaleString()} cells remaining.`)
  }
  
  return {
    allowed: errors.length === 0,
    errors
  }
}

export function calculateOverageCharge(plan: SubscriptionPlan, cellsOverQuota: number): number {
  if (plan !== 'professional' || cellsOverQuota <= 0) {
    return 0
  }
  
  const limits = getPricingLimits(plan)
  if (!limits.overageRate) {
    return 0
  }
  
  // Calculate charge for every 10,000 cells over quota
  const overageUnits = Math.ceil(cellsOverQuota / 10000)
  return overageUnits * limits.overageRate
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function getPlanDisplayName(plan: SubscriptionPlan): string {
  const names = {
    free: 'Free',
    starter: 'Starter',
    professional: 'Professional'
  }
  return names[plan]
}

export function getUpgradePrompt(currentPlan: SubscriptionPlan): string {
  const upgradeMessages = {
    free: 'Upgrade to Starter ($9/month) for more reports and higher limits!',
    starter: 'Upgrade to Professional ($29/month) for unlimited reports and white-label exports!',
    professional: 'You\'re on our highest plan!'
  }
  return upgradeMessages[currentPlan]
}
