import React from 'react'
import { MessageSquare, Target, X, Plus } from 'lucide-react'
import { CustomQuestions } from '../../types/dynamic-prompt'

interface CustomQuestionsSectionProps {
  value: CustomQuestions
  onChange: (updates: Partial<CustomQuestions>) => void
}

export function CustomQuestionsSection({ value, onChange }: CustomQuestionsSectionProps) {
  const handleFocusAreaToggle = (area: string) => {
    const currentAreas = value.focusAreas.value
    const isSelected = currentAreas.includes(area)
    
    if (isSelected) {
      onChange({
        focusAreas: {
          ...value.focusAreas,
          value: currentAreas.filter(a => a !== area)
        }
      })
    } else if (currentAreas.length < value.focusAreas.maxSelections) {
      onChange({
        focusAreas: {
          ...value.focusAreas,
          value: [...currentAreas, area]
        }
      })
    }
  }

  const handleExcludeAreaToggle = (area: string) => {
    const currentAreas = value.excludeAreas.value
    const isSelected = currentAreas.includes(area)
    
    if (isSelected) {
      onChange({
        excludeAreas: {
          ...value.excludeAreas,
          value: currentAreas.filter(a => a !== area)
        }
      })
    } else if (currentAreas.length < value.excludeAreas.maxSelections) {
      onChange({
        excludeAreas: {
          ...value.excludeAreas,
          value: [...currentAreas, area]
        }
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MessageSquare className="h-6 w-6 mr-3 text-orange-600" />
          Custom Questions & Focus Areas
        </h3>
        <p className="text-gray-600">Ask specific questions and guide the AI's focus for more targeted insights.</p>
      </div>

      {/* Key Questions */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Specific Questions</h4>
        <div className="space-y-3">
          <textarea
            value={value.keyQuestions.value}
            onChange={(e) => onChange({
              keyQuestions: { ...value.keyQuestions, value: e.target.value }
            })}
            placeholder={value.keyQuestions.placeholder}
            maxLength={value.keyQuestions.maxLength}
            rows={value.keyQuestions.rows}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>What specific insights are you looking for?</span>
            <span>{value.keyQuestions.value.length}/{value.keyQuestions.maxLength}</span>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Focus Areas</h4>
          <span className="text-sm text-gray-500">
            {value.focusAreas.value.length}/{value.focusAreas.maxSelections} selected
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {value.focusAreas.options.map((area) => {
            const isSelected = value.focusAreas.value.includes(area)
            const canSelect = !isSelected && value.focusAreas.value.length < value.focusAreas.maxSelections
            
            return (
              <button
                key={area}
                onClick={() => handleFocusAreaToggle(area)}
                disabled={!isSelected && !canSelect}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 text-orange-900'
                    : canSelect
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSelected ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{area}</span>
                </div>
              </button>
            )
          })}
        </div>
        
        {value.focusAreas.value.length > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 font-medium mb-2">Selected Focus Areas:</p>
            <div className="flex flex-wrap gap-2">
              {value.focusAreas.value.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {area}
                  <button
                    onClick={() => handleFocusAreaToggle(area)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exclude Areas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Areas to Exclude</h4>
          <span className="text-sm text-gray-500">
            {value.excludeAreas.value.length}/{value.excludeAreas.maxSelections} selected
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {value.excludeAreas.options.map((area) => {
            const isSelected = value.excludeAreas.value.includes(area)
            const canSelect = !isSelected && value.excludeAreas.value.length < value.excludeAreas.maxSelections
            
            return (
              <button
                key={area}
                onClick={() => handleExcludeAreaToggle(area)}
                disabled={!isSelected && !canSelect}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : canSelect
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSelected ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{area}</span>
                </div>
              </button>
            )
          })}
        </div>
        
        {value.excludeAreas.value.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-2">Excluded Areas:</p>
            <div className="flex flex-wrap gap-2">
              {value.excludeAreas.value.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {area}
                  <button
                    onClick={() => handleExcludeAreaToggle(area)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Examples */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="h-5 w-5 mr-2 text-orange-600" />
          Question Examples
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-800 mb-2">Performance Questions:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• "Why did sales drop in Q3?"</li>
              <li>• "Which products are most profitable?"</li>
              <li>• "What's driving customer churn?"</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-2">Strategic Questions:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• "What are our growth opportunities?"</li>
              <li>• "How can we optimize operations?"</li>
              <li>• "What trends should we watch?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

