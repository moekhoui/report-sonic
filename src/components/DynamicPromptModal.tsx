import React, { useState, useEffect } from 'react'
import { X, Settings, Brain, Target, Users, MessageSquare, FileText, BarChart3 } from 'lucide-react'
import { UserPreferences, DEFAULT_USER_PREFERENCES, DataStructure } from '../types/dynamic-prompt'
import { BusinessContextSection } from './prompt-sections/BusinessContextSection'
import { AnalysisFocusSection } from './prompt-sections/AnalysisFocusSection'
import { AudienceContextSection } from './prompt-sections/AudienceContextSection'
import { CustomQuestionsSection } from './prompt-sections/CustomQuestionsSection'
import { OutputPreferencesSection } from './prompt-sections/OutputPreferencesSection'

interface DynamicPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onAnalyze: (preferences: UserPreferences) => void
  dataStructure: DataStructure
  isAnalyzing?: boolean
}

export function DynamicPromptModal({ 
  isOpen, 
  onClose, 
  onAnalyze, 
  dataStructure,
  isAnalyzing = false 
}: DynamicPromptModalProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [activeSection, setActiveSection] = useState<string>('business')

  // Auto-detect industry and domain based on data structure
  useEffect(() => {
    if (dataStructure.columns.length > 0) {
      const updatedPreferences = { ...preferences }
      
      // Auto-detect industry based on column names
      const columnText = dataStructure.columns.join(' ').toLowerCase()
      if (columnText.includes('sales') || columnText.includes('revenue') || columnText.includes('customer')) {
        updatedPreferences.businessContext.industry.value = 'Retail'
      } else if (columnText.includes('patient') || columnText.includes('medical') || columnText.includes('health')) {
        updatedPreferences.businessContext.industry.value = 'Healthcare'
      } else if (columnText.includes('financial') || columnText.includes('profit') || columnText.includes('cost')) {
        updatedPreferences.businessContext.industry.value = 'Finance'
      } else if (columnText.includes('product') || columnText.includes('manufacturing') || columnText.includes('production')) {
        updatedPreferences.businessContext.industry.value = 'Manufacturing'
      } else if (columnText.includes('student') || columnText.includes('education') || columnText.includes('course')) {
        updatedPreferences.businessContext.industry.value = 'Education'
      } else if (columnText.includes('tech') || columnText.includes('software') || columnText.includes('development')) {
        updatedPreferences.businessContext.industry.value = 'Technology'
      }

      // Auto-detect business domain
      if (columnText.includes('sales') || columnText.includes('revenue')) {
        updatedPreferences.businessContext.businessDomain.value = 'Sales'
      } else if (columnText.includes('marketing') || columnText.includes('campaign')) {
        updatedPreferences.businessContext.businessDomain.value = 'Marketing'
      } else if (columnText.includes('employee') || columnText.includes('hr') || columnText.includes('staff')) {
        updatedPreferences.businessContext.businessDomain.value = 'HR'
      } else if (columnText.includes('operation') || columnText.includes('production')) {
        updatedPreferences.businessContext.businessDomain.value = 'Operations'
      } else if (columnText.includes('customer') || columnText.includes('service')) {
        updatedPreferences.businessContext.businessDomain.value = 'Customer Service'
      }

      setPreferences(updatedPreferences)
    }
  }, [dataStructure])

  const updatePreferences = (section: keyof UserPreferences, updates: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
  }

  const handleAnalyze = () => {
    onAnalyze(preferences)
  }

  const sections = [
    { id: 'business', label: 'Business Context', icon: Settings, color: 'bg-blue-500' },
    { id: 'focus', label: 'Analysis Focus', icon: Target, color: 'bg-green-500' },
    { id: 'audience', label: 'Audience & Style', icon: Users, color: 'bg-purple-500' },
    { id: 'questions', label: 'Custom Questions', icon: MessageSquare, color: 'bg-orange-500' },
    { id: 'output', label: 'Output Preferences', icon: FileText, color: 'bg-pink-500' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">🎯 Customize Your AI Analysis</h2>
                <p className="text-blue-100">Personalize your data analysis for better insights</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isAnalyzing}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? `${section.color} text-white shadow-md`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Data Structure Info */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Data Overview
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>{dataStructure.rowCount}</strong> rows</p>
                <p><strong>{dataStructure.columns.length}</strong> columns</p>
                <p><strong>{Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'number').length}</strong> numeric</p>
                <p><strong>{Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'string').length}</strong> text</p>
                <p><strong>{Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'date').length}</strong> date</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeSection === 'business' && (
                <BusinessContextSection
                  value={preferences.businessContext}
                  onChange={(updates) => updatePreferences('businessContext', updates)}
                />
              )}
              
              {activeSection === 'focus' && (
                <AnalysisFocusSection
                  value={preferences.analysisFocus}
                  onChange={(updates) => updatePreferences('analysisFocus', updates)}
                />
              )}
              
              {activeSection === 'audience' && (
                <AudienceContextSection
                  value={preferences.audienceContext}
                  onChange={(updates) => updatePreferences('audienceContext', updates)}
                />
              )}
              
              {activeSection === 'questions' && (
                <CustomQuestionsSection
                  value={preferences.customQuestions}
                  onChange={(updates) => updatePreferences('customQuestions', updates)}
                />
              )}
              
              {activeSection === 'output' && (
                <OutputPreferencesSection
                  value={preferences.outputPreferences}
                  onChange={(updates) => updatePreferences('outputPreferences', updates)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> The more specific your preferences, the better your analysis will be!</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isAnalyzing}
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span>Start AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

