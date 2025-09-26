import React from 'react'
import { Building2, Users, TrendingUp } from 'lucide-react'
import { BusinessContext } from '../../types/dynamic-prompt'

interface BusinessContextSectionProps {
  value: BusinessContext
  onChange: (updates: Partial<BusinessContext>) => void
}

export function BusinessContextSection({ value, onChange }: BusinessContextSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Building2 className="h-6 w-6 mr-3 text-blue-600" />
          Business Context
        </h3>
        <p className="text-gray-600">Help AI understand your business environment for more relevant insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Industry */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Industry
          </label>
          <select
            value={value.industry.value}
            onChange={(e) => onChange({
              industry: { ...value.industry, value: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {value.industry.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Select the industry that best matches your business
          </p>
        </div>

        {/* Business Domain */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Business Domain
          </label>
          <select
            value={value.businessDomain.value}
            onChange={(e) => onChange({
              businessDomain: { ...value.businessDomain, value: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {value.businessDomain.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            What business area does this data relate to?
          </p>
        </div>

        {/* Company Size */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Company Size
          </label>
          <select
            value={value.companySize.value}
            onChange={(e) => onChange({
              companySize: { ...value.companySize, value: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {value.companySize.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Helps AI provide contextually appropriate insights
          </p>
        </div>
      </div>

      {/* Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Industry Context</h4>
          </div>
          <p className="text-sm text-blue-800">
            AI will use industry-specific terminology and benchmarks for more relevant analysis.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Domain Focus</h4>
          </div>
          <p className="text-sm text-green-800">
            Analysis will be tailored to your specific business domain and objectives.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Scale Awareness</h4>
          </div>
          <p className="text-sm text-purple-800">
            Recommendations will be appropriate for your company size and resources.
          </p>
        </div>
      </div>
    </div>
  )
}

