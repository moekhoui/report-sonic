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

// AI-powered chart type analysis function
function analyzeDataForChartTypes(data: any[], analysis: any, visualizationType: string, chartData: any[]): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = []
  const sampleSize = data.length
  const columns = analysis.columns || []
  const numericCols = columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  const categoricalCols = columns.filter((col: string) => analysis.dataTypes[col] === 'string')
  const dateCols = columns.filter((col: string) => analysis.dataTypes[col] === 'date')
  
  // Analyze data characteristics
  const hasNumericData = numericCols.length > 0
  const hasCategoricalData = categoricalCols.length > 0
  const hasDateData = dateCols.length > 0
  const hasMultipleNumeric = numericCols.length >= 2
  const hasValidChartData = chartData && chartData.length > 0
  
  // Calculate data quality metrics
  const dataQuality = {
    completeness: (chartData.filter(item => item.value !== null && item.value !== undefined).length / chartData.length) * 100,
    diversity: new Set(chartData.map(item => item.name)).size,
    range: hasNumericData ? Math.max(...chartData.map(item => item.value || 0)) - Math.min(...chartData.map(item => item.value || 0)) : 0
  }

  // AI Logic for different visualization types
  switch (visualizationType) {
    case 'sales-analysis':
      if (hasCategoricalData && hasNumericData && dataQuality.completeness > 80) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'Perfect for comparing sales across categories',
          confidence: 0.95,
          reasoning: `High-quality categorical data with ${dataQuality.completeness.toFixed(0)}% completeness`,
          bestFor: ['Sales Comparison', 'Category Analysis'],
          dataRequirements: ['Categorical data', 'Numeric values'],
          example: 'Sales by product category'
        })
      }
      if (hasCategoricalData && dataQuality.diversity <= 8) {
        recommendations.push({
          chartType: 'pie',
          title: 'Pie Chart',
          description: 'Shows sales distribution across categories',
          confidence: 0.85,
          reasoning: `Good for ${dataQuality.diversity} categories with clear distribution`,
          bestFor: ['Market Share', 'Distribution Analysis'],
          dataRequirements: ['Limited categories', 'Numeric values'],
          example: 'Sales distribution by region'
        })
      }
      break

    case 'time-series':
      if (hasDateData && hasNumericData) {
        recommendations.push({
          chartType: 'line',
          title: 'Line Chart',
          description: 'Shows trends over time',
          confidence: 0.95,
          reasoning: `Perfect time series data with ${dateCols[0]} and ${numericCols[0]}`,
          bestFor: ['Trend Analysis', 'Time Series'],
          dataRequirements: ['Date column', 'Numeric values'],
          example: `${numericCols[0]} over ${dateCols[0]}`
        })
        if (dataQuality.completeness > 90) {
          recommendations.push({
            chartType: 'area',
            title: 'Area Chart',
            description: 'Shows cumulative trends over time',
            confidence: 0.85,
            reasoning: 'High-quality time series data suitable for area visualization',
            bestFor: ['Cumulative Trends', 'Volume Analysis'],
            dataRequirements: ['Date column', 'Numeric values'],
            example: 'Cumulative sales over time'
          })
        }
      } else if (hasNumericData) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'Shows sequential data values',
          confidence: 0.80,
          reasoning: 'No date data available, using sequential bar chart',
          bestFor: ['Sequential Analysis', 'Data Comparison'],
          dataRequirements: ['Numeric values'],
          example: 'Values by sequence'
        })
      }
      break

    case 'correlation-analysis':
      if (hasMultipleNumeric && dataQuality.completeness > 85) {
        recommendations.push({
          chartType: 'scatter',
          title: 'Scatter Plot',
          description: 'Shows correlation between variables',
          confidence: 0.90,
          reasoning: `Multiple numeric variables (${numericCols.length}) with high data quality`,
          bestFor: ['Correlation Analysis', 'Pattern Detection'],
          dataRequirements: ['Two numeric variables'],
          example: `${numericCols[0]} vs ${numericCols[1]}`
        })
      }
      break

    case 'distribution-analysis':
      if (hasCategoricalData && dataQuality.diversity <= 6) {
        recommendations.push({
          chartType: 'pie',
          title: 'Pie Chart',
          description: 'Shows data distribution',
          confidence: 0.90,
          reasoning: `Perfect for ${dataQuality.diversity} categories distribution`,
          bestFor: ['Distribution Analysis', 'Proportions'],
          dataRequirements: ['Limited categories'],
          example: 'Data distribution by category'
        })
        recommendations.push({
          chartType: 'doughnut',
          title: 'Doughnut Chart',
          description: 'Alternative distribution view',
          confidence: 0.80,
          reasoning: 'Good alternative to pie chart with center space',
          bestFor: ['Distribution Analysis', 'KPI Display'],
          dataRequirements: ['Limited categories'],
          example: 'Distribution with center focus'
        })
      }
      break

    case 'multi-dimensional':
      if (hasMultipleNumeric && numericCols.length >= 3) {
        recommendations.push({
          chartType: 'radar',
          title: 'Radar Chart',
          description: 'Multi-dimensional comparison',
          confidence: 0.85,
          reasoning: `Perfect for ${numericCols.length} dimensional analysis`,
          bestFor: ['Multi-dimensional Analysis', 'Comparison'],
          dataRequirements: ['Multiple numeric variables'],
          example: 'Multi-dimensional comparison'
        })
      }
      break

    case 'kpi-dashboard':
      if (hasNumericData && dataQuality.completeness > 90) {
        recommendations.push({
          chartType: 'gauge',
          title: 'Gauge Chart',
          description: 'KPI performance indicator',
          confidence: 0.90,
          reasoning: 'High-quality numeric data perfect for KPI display',
          bestFor: ['KPI Display', 'Performance Metrics'],
          dataRequirements: ['Single numeric value'],
          example: 'Performance score'
        })
      }
      if (hasCategoricalData) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'KPI comparison across categories',
          confidence: 0.80,
          reasoning: 'Good for comparing KPIs across categories',
          bestFor: ['KPI Comparison', 'Category Analysis'],
          dataRequirements: ['Categorical data', 'Numeric values'],
          example: 'KPI by category'
        })
      }
      break

    default:
      // Fallback analysis for other types
      if (hasCategoricalData && hasNumericData) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'General data comparison',
          confidence: 0.75,
          reasoning: 'Standard categorical and numeric data combination',
          bestFor: ['Data Comparison', 'Analysis'],
          dataRequirements: ['Categorical data', 'Numeric values'],
          example: 'Data comparison'
        })
      }
  }

  // Ensure we have at least one working recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      chartType: 'bar',
      title: 'Bar Chart',
      description: 'Reliable data visualization',
      confidence: 0.70,
      reasoning: 'Fallback option for data visualization',
      bestFor: ['Data Visualization'],
      dataRequirements: ['Data values'],
      example: 'Data visualization'
    })
  }

  // Sort by confidence and return top recommendations (max 3)
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}

// AI-powered data analysis function
function generateDataAnalysisParagraph(data: any[], analysis: any, visualizationType: string): string {
  const sampleSize = data.length
  const columns = analysis.columns || []
  const numericCols = columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  const categoricalCols = columns.filter((col: string) => analysis.dataTypes[col] === 'string')
  const dateCols = columns.filter((col: string) => analysis.dataTypes[col] === 'date')

  // Calculate basic statistics
  const numericStats = numericCols.map((col: string) => {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number')
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    return { col, avg, max, min, count: values.length }
  })

  // Generate analysis based on visualization type
  switch (visualizationType) {
    case 'sales-analysis':
      return `This sales performance analysis examines ${sampleSize} data points across ${columns.length} key metrics. The dataset reveals significant insights into sales patterns, with ${numericCols.length} quantitative measures including revenue, units sold, and performance indicators. Key findings show average sales values ranging from $${numericStats[0]?.min?.toFixed(0) || 0} to $${numericStats[0]?.max?.toFixed(0) || 0}, indicating ${numericStats[0]?.avg > numericStats[0]?.max * 0.7 ? 'strong' : 'moderate'} performance across the analyzed period. The data structure supports comprehensive sales analysis with ${categoricalCols.length} categorical dimensions for segmentation.`

    case 'time-series':
      const hasDateData = dateCols.length > 0
      if (hasDateData) {
        return `This temporal analysis examines ${sampleSize} data points over time using ${dateCols[0]} as the time dimension, revealing important trends and patterns in the dataset. With ${dateCols.length} time-based columns and ${numericCols.length} measurable metrics, the analysis captures how key performance indicators evolve over ${dateCols[0]}. The time series data shows ${numericStats[0]?.count || 0} valid measurements, with ${numericCols[0] || 'values'} ranging from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}. This comprehensive temporal dataset enables trend identification, seasonal pattern recognition, and predictive analysis for strategic decision-making.`
      } else {
        return `This sequential analysis examines ${sampleSize} data points in order, revealing patterns and trends in the dataset. With ${numericCols.length} measurable metrics, the analysis captures how key performance indicators change across the sequence. The data shows ${numericStats[0]?.count || 0} valid measurements, with ${numericCols[0] || 'values'} ranging from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}. This sequential dataset enables pattern identification and trend analysis for strategic decision-making.`
      }

    case 'correlation-analysis':
      return `This correlation analysis investigates relationships between ${numericCols.length} numeric variables across ${sampleSize} data points. The dataset provides rich opportunities for identifying patterns, dependencies, and statistical relationships. With variables ranging from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}, the analysis reveals ${numericStats[0]?.avg > numericStats[0]?.max * 0.6 ? 'strong' : 'moderate'} data distribution patterns. The correlation matrix will help identify key relationships that drive business performance and inform strategic decisions.`

    case 'distribution-analysis':
      return `This distribution analysis examines how data is spread across ${categoricalCols.length} categorical dimensions with ${sampleSize} total observations. The dataset shows ${numericCols.length} quantitative measures, with values distributed from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}. The distribution reveals ${numericStats[0]?.avg > numericStats[0]?.max * 0.5 ? 'balanced' : 'skewed'} patterns across categories, providing insights into market segmentation, customer behavior, and operational efficiency. This analysis supports strategic planning and resource allocation decisions.`

    case 'multi-dimensional':
      return `This multi-dimensional analysis explores complex relationships across ${columns.length} variables in ${sampleSize} data points. The dataset combines ${numericCols.length} quantitative metrics with ${categoricalCols.length} categorical dimensions, creating a comprehensive view of performance factors. Key metrics range from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}, with average values of ${numericStats[0]?.avg?.toFixed(2) || 0}. This multi-dimensional approach enables sophisticated analysis of interdependencies and provides actionable insights for strategic optimization.`

    case 'kpi-dashboard':
      return `This KPI dashboard analysis focuses on ${numericCols.length} key performance indicators across ${sampleSize} data points. The metrics show performance ranging from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}, with an average of ${numericStats[0]?.avg?.toFixed(2) || 0}. The dataset provides ${numericStats[0]?.count || 0} valid measurements, enabling comprehensive performance tracking and benchmarking. This KPI analysis supports executive decision-making and strategic performance management across all business functions.`

    default:
      return `This comprehensive data analysis examines ${sampleSize} data points across ${columns.length} variables, including ${numericCols.length} quantitative metrics and ${categoricalCols.length} categorical dimensions. The dataset reveals key insights with values ranging from ${numericStats[0]?.min?.toFixed(2) || 0} to ${numericStats[0]?.max?.toFixed(2) || 0}, providing a solid foundation for strategic analysis and decision-making. The data structure supports multiple analytical approaches and enables comprehensive business intelligence insights.`
  }
}

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
        chartTypes: analysis.columns.some((col: string) => analysis.dataTypes[col] === 'date') 
          ? ['line', 'area', 'bar'] // Only recommend line/area if we have actual date data
          : ['bar', 'line'] // Use bar as primary if no date data
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
        chartTypes: ['gauge', 'bar', 'doughnut'] // Remove line chart for KPI as it doesn't make sense without time data
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
        chartTypes: ['pie', 'doughnut', 'bar'] // Remove unsupported geo chart
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
        // AI-powered dynamic chart type analysis
        const recommendedChartTypes = analyzeDataForChartTypes(data, analysis, vizType.id, chartData)

        // Generate AI data analysis paragraph
        const dataAnalysisParagraph = generateDataAnalysisParagraph(data, analysis, vizType.id)

        visualizations.push({
          id: vizType.id,
          title: vizType.title,
          description: dataAnalysisParagraph, // Use AI-generated analysis instead of static description
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visualizations.map((visualization, index) => {
          // Create beautiful gradient colors for each visualization
          const colorSchemes = [
            'from-blue-500 to-purple-600',
            'from-green-500 to-teal-600', 
            'from-orange-500 to-red-600',
            'from-purple-500 to-pink-600',
            'from-teal-500 to-blue-600',
            'from-red-500 to-orange-600',
            'from-pink-500 to-purple-600',
            'from-indigo-500 to-blue-600',
            'from-emerald-500 to-green-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
            'from-cyan-500 to-teal-600',
            'from-violet-500 to-purple-600',
            'from-lime-500 to-green-600',
            'from-sky-500 to-blue-600',
            'from-fuchsia-500 to-pink-600'
          ]
          const colorScheme = colorSchemes[index % colorSchemes.length]
          
          return (
            <div key={visualization.id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Beautiful Header with Gradient */}
              <div className={`bg-gradient-to-r ${colorScheme} p-6 text-white`}>
                <h3 className="text-xl font-bold mb-2">{visualization.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{visualization.description}</p>
              </div>
              
              <div className="p-6">
                {/* Chart Type Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type Selection</label>
                  <div className="relative">
                    <select
                      value={visualization.selectedChartType}
                      onChange={(e) => handleChartTypeChange(visualization.id, e.target.value as ChartType)}
                      className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-colors"
                    >
                      {visualization.availableChartTypes
                        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence (highest first)
                        .map((chartRec) => (
                          <option key={chartRec.chartType} value={chartRec.chartType}>
                            {chartRec.title} - {Math.round(chartRec.confidence * 100)}% confidence
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* AI Recommendation Info */}
                {visualization.aiRecommendation && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${colorScheme} mr-3 flex-shrink-0`}>
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-blue-900 text-sm">AI Recommendation</span>
                          <span className="text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full">
                            {Math.round(visualization.aiRecommendation.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-blue-800 mb-3 leading-relaxed">{visualization.aiRecommendation.reasoning}</p>
                        <div className="flex flex-wrap gap-2">
                          {visualization.aiRecommendation.bestFor.slice(0, 3).map((use, useIndex) => (
                            <span key={useIndex} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chart Display */}
                <div className="h-72 border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
                  <ChartRenderer
                    type={visualization.selectedChartType}
                    data={visualization.data}
                    title={visualization.title}
                    width={400}
                    height={280}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Beautiful Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Analysis Summary</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visualizations</p>
                <p className="text-2xl font-bold text-gray-900">{visualizations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Columns</p>
                <p className="text-2xl font-bold text-gray-900">{analysis?.columns?.length || 0}</p>
              </div>
            </div>
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

  // If we have actual date data, use it
  if (dateCol && numericCol) {
    const validData = data
      .filter(row => row[dateCol] && row[numericCol] && !isNaN(new Date(row[dateCol]).getTime()))
      .sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime())
    
    if (validData.length > 0) {
      return validData.map(row => ({
        name: new Date(row[dateCol]).toLocaleDateString(),
        value: row[numericCol]
      }))
    }
  }

  // If no date data or invalid dates, generate sequential data
  const numericCols = analysis.columns.filter((col: string) => analysis.dataTypes[col] === 'number')
  if (numericCols.length > 0) {
    return data.slice(0, 12).map((row, index) => ({
      name: `Period ${index + 1}`,
      value: row[numericCols[0]] || Math.random() * 100
    }))
  }

  // Fallback sample data
  return [
    { name: 'Period 1', value: 20 },
    { name: 'Period 2', value: 35 },
    { name: 'Period 3', value: 28 },
    { name: 'Period 4', value: 42 },
    { name: 'Period 5', value: 38 },
    { name: 'Period 6', value: 55 }
  ]
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