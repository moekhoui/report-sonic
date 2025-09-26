import React from 'react'
import { FileText, BarChart3, CheckCircle, AlertTriangle, X, Plus } from 'lucide-react'
import { OutputPreferences } from '../../types/dynamic-prompt'

interface OutputPreferencesSectionProps {
  value: OutputPreferences
  onChange: (updates: Partial<OutputPreferences>) => void
}

export function OutputPreferencesSection({ value, onChange }: OutputPreferencesSectionProps) {
  const handleChartToggle = (chart: string) => {
    const currentCharts = value.chartPreferences.value
    const isSelected = currentCharts.includes(chart)
    
    if (isSelected) {
      onChange({
        chartPreferences: {
          ...value.chartPreferences,
          value: currentCharts.filter(c => c !== chart)
        }
      })
    } else {
      onChange({
        chartPreferences: {
          ...value.chartPreferences,
          value: [...currentCharts, chart]
        }
      })
    }
  }

  const chartIcons = {
    'Bar Charts': '📊',
    'Line Charts': '📈',
    'Pie Charts': '🥧',
    'Scatter Plots': '⚪',
    'Heatmaps': '🔥',
    'Gauges': '⏱️',
    'Radar Charts': '🕸️'
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="h-6 w-6 mr-3 text-pink-600" />
          Output Preferences
        </h3>
        <p className="text-gray-600">Customize the format and content of your analysis report.</p>
      </div>

      {/* Report Length */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Report Length</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.reportLength.options.map((option) => {
            const isSelected = value.reportLength.value === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({
                  reportLength: { ...value.reportLength, value: option.value }
                })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className={`h-6 w-6 mt-1 ${isSelected ? 'text-pink-600' : 'text-gray-400'}`} />
                  <div>
                    <h5 className={`font-semibold ${isSelected ? 'text-pink-900' : 'text-gray-900'}`}>
                      {option.label}
                    </h5>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-pink-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart Preferences */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Preferred Chart Types</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {value.chartPreferences.options.map((chart) => {
            const isSelected = value.chartPreferences.value.includes(chart)
            const icon = chartIcons[chart as keyof typeof chartIcons]
            
            return (
              <button
                key={chart}
                onClick={() => handleChartToggle(chart)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 text-pink-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-medium">{chart}</span>
                </div>
              </button>
            )
          })}
        </div>
        
        {value.chartPreferences.value.length > 0 && (
          <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
            <p className="text-sm text-pink-800 font-medium mb-2">Selected Charts:</p>
            <div className="flex flex-wrap gap-2">
              {value.chartPreferences.value.map((chart) => (
                <span
                  key={chart}
                  className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                >
                  {chartIcons[chart as keyof typeof chartIcons]} {chart}
                  <button
                    onClick={() => handleChartToggle(chart)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Additional Content</h4>
        <div className="space-y-4">
          {/* Recommendations */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h5 className="font-medium text-gray-900">Actionable Recommendations</h5>
                <p className="text-sm text-gray-600">Include specific, actionable recommendations based on the analysis</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value.includeRecommendations.value}
                onChange={(e) => onChange({
                  includeRecommendations: { ...value.includeRecommendations, value: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {/* Risk Analysis */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div>
                <h5 className="font-medium text-gray-900">Risk Assessment & Opportunities</h5>
                <p className="text-sm text-gray-600">Include risk analysis and growth opportunities</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value.includeRiskAnalysis.value}
                onChange={(e) => onChange({
                  includeRiskAnalysis: { ...value.includeRiskAnalysis, value: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Output Preview */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-pink-600" />
          Output Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Report Length:</strong> {value.reportLength.options.find(o => o.value === value.reportLength.value)?.label}</p>
          <p><strong>Charts:</strong> {value.chartPreferences.value.length > 0 ? value.chartPreferences.value.join(', ') : 'None selected'}</p>
          <p><strong>Recommendations:</strong> {value.includeRecommendations.value ? 'Included' : 'Not included'}</p>
          <p><strong>Risk Analysis:</strong> {value.includeRiskAnalysis.value ? 'Included' : 'Not included'}</p>
        </div>
        
        {/* Estimated content */}
        <div className="mt-4 p-3 bg-white rounded border border-pink-100">
          <p className="text-xs text-gray-600 mb-1">Estimated content:</p>
          <div className="text-sm text-gray-800">
            {value.reportLength.value === 'brief' && (
              <p>• Executive Summary • Key Metrics • Top 3 Insights • Recommendations</p>
            )}
            {value.reportLength.value === 'standard' && (
              <p>• Executive Summary • Data Overview • Key Insights • Trends • Recommendations • Risk Assessment</p>
            )}
            {value.reportLength.value === 'detailed' && (
              <p>• Executive Summary • Data Analysis • Statistical Insights • Trends & Patterns • Detailed Recommendations • Risk Assessment • Future Outlook</p>
            )}
            {value.reportLength.value === 'comprehensive' && (
              <p>• Executive Summary • Comprehensive Data Analysis • Statistical Deep Dive • Trend Analysis • Pattern Recognition • Detailed Recommendations • Risk Assessment • Strategic Planning • Future Scenarios • Implementation Roadmap</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

