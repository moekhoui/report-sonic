import React from 'react'
import { Target, BarChart3, TrendingUp, Search, Lightbulb } from 'lucide-react'
import { AnalysisFocus } from '../../types/dynamic-prompt'

interface AnalysisFocusSectionProps {
  value: AnalysisFocus
  onChange: (updates: Partial<AnalysisFocus>) => void
}

export function AnalysisFocusSection({ value, onChange }: AnalysisFocusSectionProps) {
  const objectiveIcons = {
    performance: BarChart3,
    trends: TrendingUp,
    comparison: Target,
    diagnostic: Search,
    strategic: Lightbulb
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Target className="h-6 w-6 mr-3 text-green-600" />
          Analysis Focus
        </h3>
        <p className="text-gray-600">Define what type of analysis you need and how deep you want to go.</p>
      </div>

      {/* Primary Objective */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Primary Objective</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.primaryObjective.options.map((option) => {
            const Icon = objectiveIcons[option.value as keyof typeof objectiveIcons]
            const isSelected = value.primaryObjective.value === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({
                  primaryObjective: { ...value.primaryObjective, value: option.value }
                })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <h5 className={`font-semibold ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                      {option.label}
                    </h5>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Analysis Depth */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Analysis Depth</h4>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Quick Overview</span>
              <span>Expert Deep Dive</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min={value.analysisDepth.range[0]}
                max={value.analysisDepth.range[1]}
                value={value.analysisDepth.value}
                onChange={(e) => onChange({
                  analysisDepth: { ...value.analysisDepth, value: parseInt(e.target.value) }
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              
              {/* Custom slider styling */}
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #10b981;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #10b981;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}</style>
            </div>
            
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                {value.analysisDepth.labels[value.analysisDepth.value - 1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Horizon */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Time Horizon</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.timeHorizon.options.map((option) => {
            const isSelected = value.timeHorizon.value === option
            
            return (
              <button
                key={option}
                onClick={() => onChange({
                  timeHorizon: { ...value.timeHorizon, value: option }
                })}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{option}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Focus Preview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-600" />
          Analysis Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Focus:</strong> {value.primaryObjective.options.find(o => o.value === value.primaryObjective.value)?.label}</p>
          <p><strong>Depth:</strong> {value.analysisDepth.labels[value.analysisDepth.value - 1]}</p>
          <p><strong>Timeframe:</strong> {value.timeHorizon.value}</p>
        </div>
      </div>
    </div>
  )
}

