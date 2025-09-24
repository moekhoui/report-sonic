'use client'

import React, { useState, useEffect } from 'react'
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
  Lightbulb,
  ChevronDown,
  Check
} from 'lucide-react'
import { ChartType, ChartRecommendation, analyzeDataForCharts, getChartRecommendations } from '@/lib/chart-types'
import { ChartRenderer } from './chart-renderer'

interface DynamicChartSelectorProps {
  data: any[]
  onChartUpdate?: (visualizations: Visualization[]) => void
}

interface Visualization {
  id: string
  title: string
  description: string
  data: any[]
  selectedChartType: ChartType
  availableChartTypes: ChartRecommendation[]
  aiRecommendation: ChartRecommendation | null
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

export function DynamicChartSelector({ data, onChartUpdate }: DynamicChartSelectorProps) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      analyzeDataAndGenerateVisualizations()
    }
  }, [data])

  const analyzeDataAndGenerateVisualizations = async () => {
    setIsAnalyzing(true)
    try {
      // Analyze the data structure
      const dataAnalysis = analyzeDataForCharts(data)
      setAnalysis(dataAnalysis)
      
      // Get AI recommendations for the entire dataset
      const allRecommendations = getChartRecommendations(dataAnalysis)
      
      // Generate multiple visualizations based on different data combinations
      const newVisualizations = generateVisualizations(data, dataAnalysis, allRecommendations)
      
      setVisualizations(newVisualizations)
      onChartUpdate?.(newVisualizations)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateVisualizations = (data: any[], analysis: any, recommendations: ChartRecommendation[]): Visualization[] => {
    const visualizations: Visualization[] = []
    
    // Get all available chart types from AI recommendations
    const allChartTypes = [...new Set(recommendations.map(rec => rec.chartType))]
    
    // Generate data for each chart type
    const chartDataMap = {
      bar: generateBarChartData(data, analysis),
      line: generateLineChartData(data, analysis),
      pie: generatePieChartData(data, analysis),
      doughnut: generateDoughnutChartData(data, analysis),
      scatter: generateScatterPlotData(data, analysis),
      radar: generateRadarChartData(data, analysis),
      gauge: generateGaugeChartData(data, analysis)
    }

    // Create visualizations for each available chart type
    allChartTypes.forEach((chartType, index) => {
      const chartData = chartDataMap[chartType as keyof typeof chartDataMap]
      if (chartData && chartData.length > 0) {
        const chartRecommendations = recommendations.filter(rec => rec.chartType === chartType)
        const primaryRecommendation = chartRecommendations[0] || {
          chartType: chartType as ChartType,
          title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
          description: `Perfect for ${chartType} visualization`,
          confidence: 0.85,
          reasoning: `Data is suitable for ${chartType} charts`,
          bestFor: ['Data Visualization'],
          dataRequirements: ['Appropriate data structure'],
          example: `${chartType} chart example`
        }

        // Get alternative chart types for this data
        const alternativeRecommendations = recommendations
          .filter(rec => rec.chartType !== chartType)
          .slice(0, 4) // Show up to 4 alternatives

        visualizations.push({
          id: `${chartType}-visualization-${index}`,
          title: `${primaryRecommendation.title} Analysis`,
          description: primaryRecommendation.description,
          data: chartData,
          selectedChartType: chartType as ChartType,
          availableChartTypes: [primaryRecommendation, ...alternativeRecommendations],
          aiRecommendation: primaryRecommendation
        })
      }
    })

    // If no recommendations, create default visualizations
    if (visualizations.length === 0) {
      const defaultData = generateBarChartData(data, analysis)
      if (defaultData.length > 0) {
        visualizations.push({
          id: 'default-bar',
          title: 'Data Analysis',
          description: 'General data visualization',
          data: defaultData,
          selectedChartType: 'bar',
          availableChartTypes: [
            {
              chartType: 'bar',
              title: 'Bar Chart',
              description: 'Perfect for comparing categories',
              confidence: 0.95,
              reasoning: 'Data has clear categories with numeric values',
              bestFor: ['Comparisons', 'Rankings', 'Categories'],
              dataRequirements: ['Categorical data', 'Numeric values'],
              example: 'Sales by region, product performance'
            },
            {
              chartType: 'pie',
              title: 'Pie Chart',
              description: 'Perfect for showing proportions',
              confidence: 0.85,
              reasoning: 'Data represents parts of a whole',
              bestFor: ['Proportions', 'Market Share', 'Distribution'],
              dataRequirements: ['Categorical data', 'Proportional values'],
              example: 'Market share, budget allocation'
            },
            {
              chartType: 'line',
              title: 'Line Chart',
              description: 'Perfect for showing trends',
              confidence: 0.80,
              reasoning: 'Data shows sequential patterns',
              bestFor: ['Trends', 'Time Series', 'Progress'],
              dataRequirements: ['Time series data', 'Sequential values'],
              example: 'Sales over time, temperature trends'
            }
          ],
          aiRecommendation: {
            chartType: 'bar',
            title: 'Bar Chart',
            description: 'Perfect for comparing categories',
            confidence: 0.95,
            reasoning: 'Data has clear categories with numeric values',
            bestFor: ['Comparisons', 'Rankings', 'Categories'],
            dataRequirements: ['Categorical data', 'Numeric values'],
            example: 'Sales by region, product performance'
          }
        })
      }
    }

    return visualizations
  }

  const handleChartTypeChange = (visualizationId: string, newChartType: ChartType) => {
    setVisualizations(prev => prev.map(viz => 
      viz.id === visualizationId 
        ? { ...viz, selectedChartType: newChartType }
        : viz
    ))
  }

  const getChartIcon = (chartType: ChartType) => {
    const IconComponent = CHART_ICONS[chartType] || BarChart3
    return <IconComponent className="h-4 w-4" />
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your data and generating visualizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dynamic Data Visualizations</h2>
        <p className="text-gray-600">
          AI-powered chart recommendations with interactive selection for each visualization
        </p>
      </div>

      {/* Visualizations */}
      {visualizations.map((visualization) => (
        <div key={visualization.id} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Visualization Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{visualization.title}</h3>
              <p className="text-sm text-gray-600">{visualization.description}</p>
            </div>
            
            {/* Chart Type Selector */}
            <div className="relative">
              <select
                value={visualization.selectedChartType}
                onChange={(e) => handleChartTypeChange(visualization.id, e.target.value as ChartType)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              >
                {visualization.availableChartTypes
                  .sort((a, b) => b.confidence - a.confidence) // Sort by confidence (highest first)
                  .map((chartRec) => (
                    <option key={chartRec.chartType} value={chartRec.chartType}>
                      {chartRec.title} - {Math.round(chartRec.confidence * 100)}% confidence
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* AI Recommendation Info */}
          {visualization.aiRecommendation && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-900">AI Recommendation</span>
                    <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      {Math.round(visualization.aiRecommendation.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">{visualization.aiRecommendation.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-blue-600 font-medium">Best for:</span>
                    {visualization.aiRecommendation.bestFor.map((use, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart Display */}
          <div className="h-80 border border-gray-100 rounded-lg p-4">
            <ChartRenderer
              type={visualization.selectedChartType}
              data={visualization.data}
              title={visualization.title}
              width={800}
              height={300}
            />
          </div>

          {/* Available Chart Types */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">Available chart types for this data:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {visualization.availableChartTypes
                .sort((a, b) => b.confidence - a.confidence)
                .map((chartRec) => (
                  <div
                    key={chartRec.chartType}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors ${
                      visualization.selectedChartType === chartRec.chartType
                        ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {getChartIcon(chartRec.chartType)}
                      <span className="ml-2 capitalize font-medium">{chartRec.chartType}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        {Math.round(chartRec.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Use the dropdown above to switch between chart types. Higher confidence scores indicate better data compatibility.
            </p>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Visualizations:</span>
            <span className="ml-2 font-medium">{visualizations.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Data Points:</span>
            <span className="ml-2 font-medium">{data.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Columns:</span>
            <span className="ml-2 font-medium">{analysis?.columns?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for generating specific chart data
function generateBarChartData(data: any[], analysis: any): any[] {
  const categoricalCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'string' && 
    new Set(data.map(row => row[col])).size < 10
  )
  const numericCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'number'
  )

  if (!categoricalCol || !numericCol) {
    // Generate sample bar chart data
    return [
      { name: 'Category A', value: 45 },
      { name: 'Category B', value: 32 },
      { name: 'Category C', value: 28 },
      { name: 'Category D', value: 19 },
      { name: 'Category E', value: 15 }
    ]
  }

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol]
    acc[key] = (acc[key] || 0) + (row[numericCol] || 0)
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

function generateLineChartData(data: any[], analysis: any): any[] {
  const dateCol = analysis.columns.find((col: string) => analysis.dataTypes[col] === 'date')
  const numericCol = analysis.columns.find((col: string) => analysis.dataTypes[col] === 'number')

  if (!dateCol || !numericCol) {
    // Generate sample line chart data
    return [
      { name: 'Jan', value: 20 },
      { name: 'Feb', value: 35 },
      { name: 'Mar', value: 28 },
      { name: 'Apr', value: 42 },
      { name: 'May', value: 38 },
      { name: 'Jun', value: 55 }
    ]
  }

  return data
    .filter(row => row[dateCol] && row[numericCol])
    .sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime())
    .map(row => ({
      name: new Date(row[dateCol]).toLocaleDateString(),
      value: row[numericCol]
    }))
}

function generatePieChartData(data: any[], analysis: any): any[] {
  const categoricalCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'string' && 
    new Set(data.map(row => row[col])).size < 8
  )

  if (!categoricalCol) {
    // Generate sample pie chart data
    return [
      { name: 'Desktop', value: 45 },
      { name: 'Mobile', value: 35 },
      { name: 'Tablet', value: 20 }
    ]
  }

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

function generateDoughnutChartData(data: any[], analysis: any): any[] {
  const categoricalCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'string' && 
    new Set(data.map(row => row[col])).size < 6
  )

  if (!categoricalCol) {
    // Generate sample doughnut chart data
    return [
      { name: 'Revenue', value: 60 },
      { name: 'Costs', value: 25 },
      { name: 'Profit', value: 15 }
    ]
  }

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

function generateScatterPlotData(data: any[], analysis: any): any[] {
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  
  if (numericCols.length < 2) {
    // Generate sample scatter plot data
    return [
      { x: 10, y: 20, r: 5 },
      { x: 15, y: 35, r: 8 },
      { x: 20, y: 25, r: 6 },
      { x: 25, y: 45, r: 10 },
      { x: 30, y: 30, r: 7 },
      { x: 35, y: 55, r: 12 },
      { x: 40, y: 40, r: 9 },
      { x: 45, y: 65, r: 11 }
    ]
  }

  return data.map(row => ({
    x: row[numericCols[0]] || 0,
    y: row[numericCols[1]] || 0,
    r: Math.random() * 10 + 5
  }))
}

function generateRadarChartData(data: any[], analysis: any): any[] {
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number').slice(0, 6)
  
  if (numericCols.length < 3) {
    // Generate sample radar chart data
    return [
      { name: 'Performance', value: 85 },
      { name: 'Quality', value: 92 },
      { name: 'Speed', value: 78 },
      { name: 'Reliability', value: 88 },
      { name: 'Innovation', value: 75 },
      { name: 'Support', value: 90 }
    ]
  }

  const avgValues = numericCols.map((col: string) => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number')
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  })

  return numericCols.map((col: string, index: number) => ({
    name: col,
    value: avgValues[index]
  }))
}

function generateGaugeChartData(data: any[], analysis: any): any[] {
  const numericCol = analysis.columns.find((col: string) => analysis.dataTypes[col] === 'number')
  
  if (!numericCol) {
    // Generate sample gauge chart data
    return [{
      value: 75,
      max: 100,
      label: 'Performance Score'
    }]
  }

  const values = data.map(row => row[numericCol]).filter(val => typeof val === 'number')
  const avgValue = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  const maxValue = Math.max(...values) * 1.2 || 100

  return [{
    value: Math.round(avgValue),
    max: Math.round(maxValue),
    label: numericCol
  }]
}