import React from 'react'
import { Users, Crown, Briefcase, BarChart3, Globe, MessageSquare, FileText, Eye, Zap } from 'lucide-react'
import { AudienceContext } from '../../types/dynamic-prompt'

interface AudienceContextSectionProps {
  value: AudienceContext
  onChange: (updates: Partial<AudienceContext>) => void
}

export function AudienceContextSection({ value, onChange }: AudienceContextSectionProps) {
  const audienceIcons = {
    executive: Crown,
    management: Briefcase,
    analysts: BarChart3,
    stakeholders: Globe
  }

  const styleIcons = {
    formal: FileText,
    conversational: MessageSquare,
    technical: BarChart3,
    visual: Eye
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="h-6 w-6 mr-3 text-purple-600" />
          Audience & Communication Style
        </h3>
        <p className="text-gray-600">Tailor the analysis and presentation style to your target audience.</p>
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Target Audience</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.targetAudience.options.map((option) => {
            const Icon = audienceIcons[option.value as keyof typeof audienceIcons]
            const isSelected = value.targetAudience.value === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({
                  targetAudience: { ...value.targetAudience, value: option.value }
                })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div>
                    <h5 className={`font-semibold ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                      {option.label}
                    </h5>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Communication Style */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Communication Style</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.communicationStyle.options.map((option) => {
            const Icon = styleIcons[option.value as keyof typeof styleIcons]
            const isSelected = value.communicationStyle.value === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => onChange({
                  communicationStyle: { ...value.communicationStyle, value: option.value }
                })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div>
                    <h5 className={`font-semibold ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                      {option.label}
                    </h5>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Urgency Level */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Analysis Urgency</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.urgency.options.map((option) => {
            const isSelected = value.urgency.value === option
            const urgencyLevel = option.includes('Low') ? 'low' : 
                                option.includes('Medium') ? 'medium' :
                                option.includes('High') ? 'high' : 'critical'
            
            const urgencyColors = {
              low: 'border-green-500 bg-green-50 text-green-900',
              medium: 'border-yellow-500 bg-yellow-50 text-yellow-900',
              high: 'border-orange-500 bg-orange-50 text-orange-900',
              critical: 'border-red-500 bg-red-50 text-red-900'
            }
            
            return (
              <button
                key={option}
                onClick={() => onChange({
                  urgency: { ...value.urgency, value: option }
                })}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? urgencyColors[urgencyLevel as keyof typeof urgencyColors]
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {urgencyLevel === 'critical' && <Zap className="h-4 w-4" />}
                  <div className="text-sm font-medium">{option}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Style Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
          Communication Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Audience:</strong> {value.targetAudience.options.find(o => o.value === value.targetAudience.value)?.label}</p>
          <p><strong>Style:</strong> {value.communicationStyle.options.find(o => o.value === value.communicationStyle.value)?.label}</p>
          <p><strong>Urgency:</strong> {value.urgency.value}</p>
        </div>
        
        {/* Example tone based on selections */}
        <div className="mt-4 p-3 bg-white rounded border border-purple-100">
          <p className="text-xs text-gray-600 mb-1">Example tone:</p>
          <p className="text-sm text-gray-800 italic">
            {value.targetAudience.value === 'executive' && value.communicationStyle.value === 'formal' 
              ? "Based on the comprehensive analysis of your data, we have identified key performance indicators that require immediate executive attention..."
              : value.communicationStyle.value === 'conversational'
              ? "Here's what we found in your data - some really interesting patterns that could help your business grow..."
              : value.communicationStyle.value === 'technical'
              ? "Statistical analysis reveals significant correlations (p < 0.05) between variables X and Y, indicating..."
              : "The visual analysis shows clear trends and patterns that tell a compelling story about your business performance..."
            }
          </p>
        </div>
      </div>
    </div>
  )
}

