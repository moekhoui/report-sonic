import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UsageDisplay } from './UsageDisplay'
import { LimitExceededModal } from './LimitExceededModal'
import { UsageStats } from '../types'
import { SubscriptionPlan } from '../utils/pricingCalculator'
import { calculateUsageStats, calculateCells } from '../utils/pricingCalculator'
import { useRouter } from 'next/router'

interface DashboardHeaderProps {
  onFileUpload: (file: File) => Promise<void>
  uploading: boolean
}

export function DashboardHeader({ onFileUpload, uploading }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitErrors, setLimitErrors] = useState<string[]>([])
  const [cellsUsed, setCellsUsed] = useState(0)

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Calculate cells for limit checking
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0]?.split(',') || []
        const rows = lines.slice(1)
        
        const data = rows.map(row => {
          const values = row.split(',')
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || ''
          })
          return obj
        })

        const cells = calculateCells(data)
        setCellsUsed(cells)

        // Check limits
        if (userData && usage) {
          const plan = userData.subscription_plan as SubscriptionPlan || 'free'
          const { PRICING_PLANS } = require('../utils/pricingCalculator')
          const limits = PRICING_PLANS[plan]
          
          const errors: string[] = []
          
          // Check report count limit
          if (usage.monthlyReportsUsed >= limits.reportsPerMonth) {
            errors.push(`You've reached your monthly report limit of ${limits.reportsPerMonth} reports.`)
          }
          
          // Check cells per report limit
          if (cells > limits.maxCellsPerReport) {
            errors.push(`This file exceeds the maximum ${limits.maxCellsPerReport.toLocaleString()} cells per report limit.`)
          }
          
          // Check monthly cell quota
          if (usage.monthlyCellsUsed + cells > limits.cellsPerMonth) {
            const remainingCells = limits.cellsPerMonth - usage.monthlyCellsUsed
            errors.push(`This would exceed your monthly cell quota. You have ${remainingCells.toLocaleString()} cells remaining.`)
          }

          if (errors.length > 0) {
            setLimitErrors(errors)
            setShowLimitModal(true)
            return
          }
        }

        // If no limits exceeded, proceed with upload
        onFileUpload(file)
      } catch (error) {
        console.error('Error parsing file for limit check:', error)
        // Proceed with upload anyway
        onFileUpload(file)
      }
    }
    reader.readAsText(file)
  }

  const handleUpgrade = () => {
    router.push('/subscription')
  }

  if (!userData || !usage) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Usage Display */}
      <UsageDisplay
        usage={usage}
        plan={userData.subscription_plan as SubscriptionPlan || 'free'}
        onUpgrade={handleUpgrade}
      />

      {/* Usage Information Only - Upload moved to top of page */}

      {/* Limit Exceeded Modal */}
      <LimitExceededModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={handleUpgrade}
        errors={limitErrors}
        currentPlan={userData.subscription_plan as SubscriptionPlan || 'free'}
        cellsUsed={cellsUsed}
      />
    </div>
  )
}
