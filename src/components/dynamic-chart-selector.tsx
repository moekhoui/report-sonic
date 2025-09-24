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
    
    // 1. Sales Analysis Visualization
    const salesData = generateSalesData(data, analysis)
    if (salesData.length > 0) {
      const salesRecommendations = recommendations.filter(rec => 
        rec.chartType === 'bar' || rec.chartType === 'line' || rec.chartType === 'pie'
      )
      visualizations.push({
        id: 'sales-analysis',
        title: 'Sales Performance Analysis',
        description: 'Comprehensive sales data across different dimensions',
        data: salesData,
        selectedChartType: salesRecommendations[0]?.chartType || 'bar',
        availableChartTypes: salesRecommendations,
        aiRecommendation: salesRecommendations[0] || null
      })
    }

    // 2. Time Series Visualization
    const timeSeriesData = generateTimeSeriesData(data, analysis)
    if (timeSeriesData.length > 0) {
      const timeRecommendations = recommendations.filter(rec => 
        rec.chartType === 'line' || rec.chartType === 'area' || rec.chartType === 'bar'
      )
      visualizations.push({
        id: 'time-series',
        title: 'Trend Analysis Over Time',
        description: 'How key metrics change over time',
        data: timeSeriesData,
        selectedChartType: timeRecommendations[0]?.chartType || 'line',
        availableChartTypes: timeRecommendations,
        aiRecommendation: timeRecommendations[0] || null
      })
    }

    // 3. Correlation Analysis
    const correlationData = generateCorrelationData(data, analysis)
    if (correlationData.length > 0) {
      const correlationRecommendations = recommendations.filter(rec => 
        rec.chartType === 'scatter' || rec.chartType === 'bubble' || rec.chartType === 'heatmap'
      )
      visualizations.push({
        id: 'correlation-analysis',
        title: 'Data Correlation Analysis',
        description: 'Relationships between different variables',
        data: correlationData,
        selectedChartType: correlationRecommendations[0]?.chartType || 'scatter',
        availableChartTypes: correlationRecommendations,
        aiRecommendation: correlationRecommendations[0] || null
      })
    }

    // 4. Distribution Analysis
    const distributionData = generateDistributionData(data, analysis)
    if (distributionData.length > 0) {
      const distributionRecommendations = recommendations.filter(rec => 
        rec.chartType === 'pie' || rec.chartType === 'doughnut' || rec.chartType === 'bar'
      )
      visualizations.push({
        id: 'distribution-analysis',
        title: 'Data Distribution Analysis',
        description: 'How data is distributed across categories',
        data: distributionData,
        selectedChartType: distributionRecommendations[0]?.chartType || 'pie',
        availableChartTypes: distributionRecommendations,
        aiRecommendation: distributionRecommendations[0] || null
      })
    }

    // 5. Multi-dimensional Analysis
    const multiDimData = generateMultiDimensionalData(data, analysis)
    if (multiDimData.length > 0) {
      const multiDimRecommendations = recommendations.filter(rec => 
        rec.chartType === 'radar' || rec.chartType === 'heatmap' || rec.chartType === 'treemap'
      )
      visualizations.push({
        id: 'multi-dimensional',
        title: 'Multi-Dimensional Analysis',
        description: 'Complex data relationships across multiple dimensions',
        data: multiDimData,
        selectedChartType: multiDimRecommendations[0]?.chartType || 'radar',
        availableChartTypes: multiDimRecommendations,
        aiRecommendation: multiDimRecommendations[0] || null
      })
    }

    // 6. KPI Dashboard
    const kpiData = generateKPIData(data, analysis)
    if (kpiData.length > 0) {
      const kpiRecommendations = recommendations.filter(rec => 
        rec.chartType === 'gauge' || rec.chartType === 'bar' || rec.chartType === 'line'
      )
      visualizations.push({
        id: 'kpi-dashboard',
        title: 'Key Performance Indicators',
        description: 'Critical metrics and performance indicators',
        data: kpiData,
        selectedChartType: kpiRecommendations[0]?.chartType || 'gauge',
        availableChartTypes: kpiRecommendations,
        aiRecommendation: kpiRecommendations[0] || null
      })
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
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {visualization.availableChartTypes.map((chartRec) => (
                  <option key={chartRec.chartType} value={chartRec.chartType}>
                    {chartRec.title} ({Math.round(chartRec.confidence * 100)}%)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* AI Recommendation Info */}
          {visualization.aiRecommendation && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-blue-900">AI Recommendation: </span>
                  <span className="text-blue-700">{visualization.aiRecommendation.reasoning}</span>
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
            <p className="text-xs text-gray-500 mb-2">Available chart types for this data:</p>
            <div className="flex flex-wrap gap-2">
              {visualization.availableChartTypes.map((chartRec) => (
                <div
                  key={chartRec.chartType}
                  className={`flex items-center px-2 py-1 rounded text-xs ${
                    visualization.selectedChartType === chartRec.chartType
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {getChartIcon(chartRec.chartType)}
                  <span className="ml-1 capitalize">{chartRec.chartType}</span>
                  <span className="ml-1 text-xs opacity-75">
                    {Math.round(chartRec.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
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

// Helper functions for generating different types of data
function generateSalesData(data: any[], analysis: any): any[] {
  const categoricalCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'string' && 
    new Set(data.map(row => row[col])).size < 10
  )
  const salesCol = analysis.columns.find((col: string) => 
    col.toLowerCase().includes('sales') && analysis.dataTypes[col] === 'number'
  )

  if (!categoricalCol || !salesCol) return []

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol]
    acc[key] = (acc[key] || 0) + (row[salesCol] || 0)
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

function generateTimeSeriesData(data: any[], analysis: any): any[] {
  const dateCol = analysis.columns.find((col: string) => analysis.dataTypes[col] === 'date')
  const numericCol = analysis.columns.find((col: string) => analysis.dataTypes[col] === 'number')

  if (!dateCol || !numericCol) return []

  return data
    .filter(row => row[dateCol] && row[numericCol])
    .sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime())
    .map(row => ({
      name: new Date(row[dateCol]).toLocaleDateString(),
      value: row[numericCol]
    }))
}

function generateCorrelationData(data: any[], analysis: any): any[] {
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  
  if (numericCols.length < 2) return []

  return data.map(row => ({
    x: row[numericCols[0]] || 0,
    y: row[numericCols[1]] || 0,
    r: Math.random() * 10 + 5
  }))
}

function generateDistributionData(data: any[], analysis: any): any[] {
  const categoricalCol = analysis.columns.find((col: string) => 
    analysis.dataTypes[col] === 'string' && 
    new Set(data.map(row => row[col])).size < 8
  )

  if (!categoricalCol) return []

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

function generateMultiDimensionalData(data: any[], analysis: any): any[] {
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number').slice(0, 6)
  
  if (numericCols.length < 3) return []

  const avgValues = numericCols.map((col: string) => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number')
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  })

  return numericCols.map((col: string, index: number) => ({
    name: col,
    value: avgValues[index]
  }))
}

function generateKPIData(data: any[], analysis: any): any[] {
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  
  if (numericCols.length === 0) return []

  const values = data.map(row => row[numericCols[0]]).filter(val => typeof val === 'number')
  const avgValue = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  const maxValue = Math.max(...values) * 1.2 || 100

  return [{
    value: Math.round(avgValue),
    max: Math.round(maxValue),
    label: numericCols[0]
  }]
}
