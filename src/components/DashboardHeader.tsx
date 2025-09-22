import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UsageDisplay } from './UsageDisplay'
import { LimitExceededModal } from './LimitExceededModal'
import { SubscriptionPlan, UsageStats } from '../types'
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

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Generate New Report
        </h2>
        <p className="text-gray-600 mb-6">
          Upload your Excel file and let AI generate a comprehensive report
        </p>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          />
          <button
            disabled={uploading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Choose File to Upload'
            )}
          </button>
        </div>
      </div>

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
