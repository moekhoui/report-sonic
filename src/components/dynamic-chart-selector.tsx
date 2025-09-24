'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
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
  scatter: Target,
  bubble: Target,
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
      console.log('🔍 Starting data analysis with data:', data)
      
      // Analyze the data structure
      const dataAnalysis = analyzeDataForCharts(data)
      console.log('📊 Data analysis result:', dataAnalysis)
      setAnalysis(dataAnalysis)
      
      // Get AI recommendations for the entire dataset
      const allRecommendations = getChartRecommendations(dataAnalysis)
      console.log('🤖 AI recommendations:', allRecommendations)
      
      // Generate multiple visualizations based on different data combinations
      const newVisualizations = generateVisualizations(data, dataAnalysis, allRecommendations)
      console.log('📈 Generated visualizations:', newVisualizations)
      
      setVisualizations(newVisualizations)
      onChartUpdate?.(newVisualizations)
    } catch (error) {
      console.error('❌ Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateVisualizations = (data: any[], analysis: any, recommendations: ChartRecommendation[]): Visualization[] => {
    const visualizations: Visualization[] = []
    
    console.log('🎯 Generating visualizations with:', { data: data.length, analysis, recommendations: recommendations.length })
    
    // Generate comprehensive visualizations based on data analysis
    const visualizationTypes = [
      {
        id: 'sales-analysis',
        title: 'Sales Performance Analysis',
        description: 'Comprehensive analysis of sales data across different dimensions',
        dataGenerator: () => generateBarChartData(data, analysis),
        chartTypes: ['bar', 'pie', 'doughnut', 'line']
      },
      {
        id: 'time-series',
        title: 'Trend Analysis Over Time',
        description: 'How key metrics change over time periods',
        dataGenerator: () => generateLineChartData(data, analysis),
        chartTypes: ['line', 'area', 'bar']
      },
      {
        id: 'correlation-analysis',
        title: 'Data Correlation Analysis',
        description: 'Relationships between different variables in your data',
        dataGenerator: () => generateScatterPlotData(data, analysis),
        chartTypes: ['scatter', 'bubble', 'heatmap']
      },
      {
        id: 'distribution-analysis',
        title: 'Data Distribution Analysis',
        description: 'How data is distributed across different categories',
        dataGenerator: () => generatePieChartData(data, analysis),
        chartTypes: ['pie', 'doughnut', 'bar']
      },
      {
        id: 'multi-dimensional',
        title: 'Multi-Dimensional Analysis',
        description: 'Complex data relationships across multiple dimensions',
        dataGenerator: () => generateRadarChartData(data, analysis),
        chartTypes: ['radar', 'heatmap', 'treemap']
      },
      {
        id: 'kpi-dashboard',
        title: 'Key Performance Indicators',
        description: 'Critical metrics and performance indicators',
        dataGenerator: () => generateGaugeChartData(data, analysis),
        chartTypes: ['gauge', 'bar', 'line']
      },
      {
        id: 'category-comparison',
        title: 'Category Comparison Analysis',
        description: 'Comparing performance across different categories',
        dataGenerator: () => generateBarChartData(data, analysis),
        chartTypes: ['bar', 'pie', 'doughnut']
      },
      {
        id: 'performance-metrics',
        title: 'Performance Metrics Overview',
        description: 'Overview of key performance metrics and trends',
        dataGenerator: () => generateLineChartData(data, analysis),
        chartTypes: ['line', 'area', 'gauge']
      },
      {
        id: 'market-analysis',
        title: 'Market Analysis',
        description: 'Market share and competitive analysis',
        dataGenerator: () => generatePieChartData(data, analysis),
        chartTypes: ['pie', 'doughnut', 'bar']
      },
      {
        id: 'customer-segments',
        title: 'Customer Segment Analysis',
        description: 'Analysis of different customer segments',
        dataGenerator: () => generateRadarChartData(data, analysis),
        chartTypes: ['radar', 'pie', 'bar']
      },
      {
        id: 'revenue-breakdown',
        title: 'Revenue Breakdown Analysis',
        description: 'Detailed breakdown of revenue sources',
        dataGenerator: () => generateBarChartData(data, analysis),
        chartTypes: ['bar', 'pie', 'waterfall']
      },
      {
        id: 'growth-trends',
        title: 'Growth Trends Analysis',
        description: 'Growth patterns and trend analysis',
        dataGenerator: () => generateLineChartData(data, analysis),
        chartTypes: ['line', 'area', 'bar']
      },
      {
        id: 'product-performance',
        title: 'Product Performance Analysis',
        description: 'Individual product performance metrics',
        dataGenerator: () => generateBarChartData(data, analysis),
        chartTypes: ['bar', 'scatter', 'radar']
      },
      {
        id: 'geographic-analysis',
        title: 'Geographic Distribution',
        description: 'Data distribution across geographic regions',
        dataGenerator: () => generatePieChartData(data, analysis),
        chartTypes: ['pie', 'doughnut', 'geo']
      },
      {
        id: 'seasonal-patterns',
        title: 'Seasonal Pattern Analysis',
        description: 'Seasonal trends and patterns in data',
        dataGenerator: () => generateLineChartData(data, analysis),
        chartTypes: ['line', 'area', 'heatmap']
      },
      {
        id: 'efficiency-metrics',
        title: 'Efficiency Metrics',
        description: 'Operational efficiency and productivity metrics',
        dataGenerator: () => generateGaugeChartData(data, analysis),
        chartTypes: ['gauge', 'bar', 'line']
      }
    ]

    // Generate visualizations for each type
    visualizationTypes.forEach((vizType, index) => {
      const chartData = vizType.dataGenerator()
      if (chartData && chartData.length > 0) {
        // Get recommended chart types for this data
        const recommendedChartTypes = recommendations
          .filter(rec => vizType.chartTypes.includes(rec.chartType))
          .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
          .slice(0, 5) // Max 5 recommendations

        // If no specific recommendations, create default ones
        if (recommendedChartTypes.length === 0) {
          const defaultRecommendations = vizType.chartTypes.slice(0, 3).map(chartType => ({
            chartType: chartType as ChartType,
            title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
            description: `Perfect for ${vizType.title.toLowerCase()}`,
            confidence: 0.8,
            reasoning: `Data is suitable for ${chartType} visualization`,
            bestFor: ['Data Analysis'],
            dataRequirements: ['Appropriate data structure'],
            example: `${chartType} chart example`
          }))
          recommendedChartTypes.push(...defaultRecommendations)
        }

        // Ensure we have at least one recommendation
        if (recommendedChartTypes.length === 0) {
          recommendedChartTypes.push({
            chartType: 'bar' as ChartType,
            title: 'Bar Chart',
            description: 'Perfect for data comparison',
            confidence: 0.7,
            reasoning: 'Default chart type for data visualization',
            bestFor: ['Data Analysis'],
            dataRequirements: ['Data values'],
            example: 'Data comparison chart'
          })
        }

        visualizations.push({
          id: vizType.id,
          title: vizType.title,
          description: vizType.description,
          data: chartData,
          selectedChartType: recommendedChartTypes[0].chartType,
          availableChartTypes: recommendedChartTypes,
          aiRecommendation: recommendedChartTypes[0]
        })
      }
    })

    console.log('📈 Generated visualizations:', visualizations.length)
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

      {/* Visualizations - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizations.map((visualization) => (
          <div key={visualization.id} className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Visualization Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{visualization.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{visualization.description}</p>
              
              {/* Chart Type Selector */}
              <div className="relative">
                <select
                  value={visualization.selectedChartType}
                  onChange={(e) => handleChartTypeChange(visualization.id, e.target.value as ChartType)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
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
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Brain className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-blue-900 text-sm">AI Recommendation</span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        {Math.round(visualization.aiRecommendation.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-blue-800 mb-2">{visualization.aiRecommendation.reasoning}</p>
                    <div className="flex flex-wrap gap-1">
                      {visualization.aiRecommendation.bestFor.slice(0, 3).map((use, index) => (
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
            <div className="h-64 border border-gray-100 rounded-lg p-3">
              <ChartRenderer
                type={visualization.selectedChartType}
                data={visualization.data}
                title={visualization.title}
                width={400}
                height={250}
              />
            </div>
          </div>
        ))}
      </div>

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