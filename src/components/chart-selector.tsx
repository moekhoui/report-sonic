'use client'

import React, { useState } from 'react'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
  Scatter, 
  Activity,
  Map,
  Gauge,
  TrendingUp,
  Layers,
  Zap,
  Brain,
  Lightbulb
} from 'lucide-react'
import { ChartType, ChartRecommendation } from '@/lib/chart-types'

interface ChartSelectorProps {
  recommendations: ChartRecommendation[]
  onChartSelect: (chartType: ChartType) => void
  selectedChart?: ChartType
}

const CHART_ICONS: Record<ChartType, React.ComponentType<any>> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  doughnut: PieChart,
  polarArea: Target,
  radar: Target,
  scatter: Scatter,
  bubble: Scatter,
  area: Activity,
  mixed: Layers,
  gauge: Gauge,
  funnel: TrendingUp,
  waterfall: TrendingUp,
  treemap: Layers,
  heatmap: Map,
  boxplot: BarChart3,
  histogram: BarChart3,
  candlestick: BarChart3,
  sankey: Activity,
  sunburst: PieChart,
  wordcloud: Target,
  network: Map,
  timeline: LineChart,
  geo: Map,
  '3d': Layers
}

const CHART_CATEGORIES = {
  'Basic Charts': ['bar', 'line', 'pie', 'doughnut', 'area'],
  'Advanced Charts': ['scatter', 'bubble', 'radar', 'polarArea'],
  'Statistical Charts': ['histogram', 'boxplot', 'heatmap'],
  'Specialized Charts': ['gauge', 'funnel', 'waterfall', 'treemap'],
  'Geographic Charts': ['geo', 'map'],
  'Time Series': ['timeline', 'mixed']
}

export function ChartSelector({ recommendations, onChartSelect, selectedChart }: ChartSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Basic Charts')
  const [showAIRecommendations, setShowAIRecommendations] = useState(true)

  const getChartIcon = (chartType: ChartType) => {
    const IconComponent = CHART_ICONS[chartType] || BarChart3
    return <IconComponent className="h-5 w-5" />
  }

  const getChartRecommendation = (chartType: ChartType) => {
    return recommendations.find(rec => rec.chartType === chartType)
  }

  const renderChartOption = (chartType: ChartType) => {
    const recommendation = getChartRecommendation(chartType)
    const isSelected = selectedChart === chartType
    const confidence = recommendation?.confidence || 0

    return (
      <div
        key={chartType}
        className={`
          relative p-4 border rounded-lg cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }
        `}
        onClick={() => onChartSelect(chartType)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {getChartIcon(chartType)}
            </div>
            <div>
              <h4 className="font-medium capitalize">
                {chartType.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              {recommendation && (
                <p className="text-sm text-gray-600">{recommendation.description}</p>
              )}
            </div>
          </div>
          
          {recommendation && (
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-600">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-500">
              <strong>Best for:</strong> {recommendation.bestFor.slice(0, 2).join(', ')}
              {recommendation.bestFor.length > 2 && ` +${recommendation.bestFor.length - 2} more`}
            </div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <strong>AI Insight:</strong> {recommendation.reasoning}
            </div>
          </div>
        )}

        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Chart Type</h2>
          <button
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className={`
              flex items-center px-4 py-2 rounded-lg transition-colors
              ${showAIRecommendations 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
              }
            `}
          >
            <Brain className="h-4 w-4 mr-2" />
            {showAIRecommendations ? 'Hide AI Recommendations' : 'Show AI Recommendations'}
          </button>
        </div>
        
        {showAIRecommendations && recommendations.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI-Powered Chart Recommendations</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Based on your data analysis, I've identified the most suitable chart types for your data. 
                  Charts with higher confidence scores are more likely to provide meaningful insights.
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-center bg-white px-3 py-1 rounded-full text-sm">
                      <span className="font-medium mr-2 capitalize">{rec.chartType}</span>
                      <span className="text-green-600 font-medium">{Math.round(rec.confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(CHART_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHART_CATEGORIES[selectedCategory as keyof typeof CHART_CATEGORIES]?.map((chartType) => 
          renderChartOption(chartType as ChartType)
        )}
      </div>

      {/* Chart Type Guide */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="h-5 w-5 text-gray-600 mr-2" />
          Chart Type Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">When to Use Each Chart Type:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Bar Charts:</strong> Compare values across categories</li>
              <li><strong>Line Charts:</strong> Show trends over time</li>
              <li><strong>Pie Charts:</strong> Show parts of a whole</li>
              <li><strong>Scatter Plots:</strong> Find correlations between variables</li>
              <li><strong>Heatmaps:</strong> Show patterns in large datasets</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">AI Recommendations:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Confidence scores help you choose the best chart</li>
              <li>• AI analyzes your data structure automatically</li>
              <li>• Recommendations include reasoning and use cases</li>
              <li>• Multiple chart types can tell a complete story</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
