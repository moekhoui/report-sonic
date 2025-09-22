import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import UserMySQL, { IUser } from '../lib/models/UserMySQL'
import { checkLimits, calculateCells, getPricingLimits, SubscriptionPlan } from '../utils/pricingCalculator'

export interface LimitCheckResult {
  allowed: boolean
  errors: string[]
  cellsUsed: number
  upgradePrompt?: string
}

export async function checkUserLimits(
  req: NextApiRequest,
  res: NextApiResponse,
  fileData: any[]
): Promise<LimitCheckResult> {
  try {
    // Get user session
    const session = await getSession({ req })
    if (!session?.user?.id) {
      return {
        allowed: false,
        errors: ['Authentication required'],
        cellsUsed: 0
      }
    }

    // Get user from database
    const user = await UserMySQL.findById(parseInt(session.user.id))
    if (!user) {
      return {
        allowed: false,
        errors: ['User not found'],
        cellsUsed: 0
      }
    }

    // Calculate cells needed for this file
    const cellsUsed = calculateCells(fileData)
    
    // Check if we need to reset monthly usage
    await resetMonthlyUsageIfNeeded(user)

    // Get updated user data after potential reset
    const updatedUser = await UserMySQL.findById(user.id!)
    if (!updatedUser) {
      return {
        allowed: false,
        errors: ['Failed to get user data'],
        cellsUsed
      }
    }

    // Check limits
    const plan = updatedUser.subscription_plan as SubscriptionPlan || 'free'
    const limitCheck = checkLimits(
      plan,
      updatedUser.monthly_cells_used || 0,
      updatedUser.monthly_reports_used || 0,
      fileData
    )

    // Generate upgrade prompt if limits exceeded
    let upgradePrompt: string | undefined
    if (!limitCheck.allowed) {
      upgradePrompt = getUpgradePrompt(plan)
    }

    return {
      allowed: limitCheck.allowed,
      errors: limitCheck.errors,
      cellsUsed,
      upgradePrompt
    }
  } catch (error) {
    console.error('Limit check error:', error)
    return {
      allowed: false,
      errors: ['Internal server error'],
      cellsUsed: 0
    }
  }
}

export async function resetMonthlyUsageIfNeeded(user: IUser): Promise<void> {
  if (!user.last_reset_date) {
    return
  }

  const lastReset = new Date(user.last_reset_date)
  const now = new Date()
  const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth())

  if (monthsDiff >= 1) {
    await UserMySQL.resetMonthlyUsage()
  }
}

export async function incrementUserUsage(
  userId: number,
  cellsUsed: number,
  reportId?: number
): Promise<void> {
  try {
    // Increment usage counters
    await UserMySQL.incrementUsage(userId, cellsUsed, 1)
    
    // Log usage for analytics
    await UserMySQL.logUsage(
      userId,
      reportId || null,
      'report_generated',
      cellsUsed,
      1,
      { timestamp: new Date().toISOString() }
    )
  } catch (error) {
    console.error('Failed to increment usage:', error)
    throw error
  }
}

export function getUpgradePrompt(plan: SubscriptionPlan): string {
  const prompts = {
    free: 'Upgrade to Starter ($9/month) for 25 reports and 500K cells monthly!',
    starter: 'Upgrade to Professional ($29/month) for 100 reports and 2M cells monthly!',
    professional: 'You\'re on our highest plan! Contact support for enterprise options.'
  }
  return prompts[plan]
}

export function createLimitExceededResponse(
  errors: string[],
  upgradePrompt: string
): NextApiResponse {
  return {
    status: 429,
    json: () => ({
      error: 'Usage limit exceeded',
      message: errors.join(' '),
      upgradePrompt,
      limitExceeded: true
    })
  } as NextApiResponse
}

export function withLimitCheck(
  handler: (req: NextApiRequest, res: NextApiResponse, fileData: any[]) => Promise<any>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract file data from request
      const fileData = req.body?.data || []
      
      // Check limits
      const limitResult = await checkUserLimits(req, res, fileData)
      
      if (!limitResult.allowed) {
        return res.status(429).json({
          error: 'Usage limit exceeded',
          message: limitResult.errors.join(' '),
          upgradePrompt: limitResult.upgradePrompt,
          limitExceeded: true,
          cellsUsed: limitResult.cellsUsed
        })
      }

      // Call the original handler
      const result = await handler(req, res, fileData)
      
      // Increment usage after successful processing
      const session = await getSession({ req })
      if (session?.user?.id) {
        await incrementUserUsage(
          parseInt(session.user.id),
          limitResult.cellsUsed
        )
      }
      
      return result
    } catch (error) {
      console.error('Limit check middleware error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
