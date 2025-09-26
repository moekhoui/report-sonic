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

    case 'qualitative-analysis':
      if (hasCategoricalData && dataQuality.diversity <= 8) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'Perfect for qualitative response analysis',
          confidence: 0.95,
          reasoning: `High-quality qualitative data with ${dataQuality.diversity} response categories`,
          bestFor: ['Survey Analysis', 'Feedback Review'],
          dataRequirements: ['Qualitative responses', 'Categorical data'],
          example: 'Survey response distribution'
        })
      }
      if (hasCategoricalData && dataQuality.diversity <= 6) {
        recommendations.push({
          chartType: 'pie',
          title: 'Pie Chart',
          description: 'Shows qualitative response distribution',
          confidence: 0.85,
          reasoning: `Good for ${dataQuality.diversity} response categories`,
          bestFor: ['Response Distribution', 'Feedback Analysis'],
          dataRequirements: ['Limited response categories'],
          example: 'Customer satisfaction distribution'
        })
      }
      break

    case 'rating-analysis':
      if (hasNumericData && dataQuality.completeness > 80) {
        recommendations.push({
          chartType: 'bar',
          title: 'Bar Chart',
          description: 'Perfect for rating scale visualization',
          confidence: 0.95,
          reasoning: `High-quality rating data with ${dataQuality.completeness.toFixed(0)}% completeness`,
          bestFor: ['Rating Analysis', 'Satisfaction Metrics'],
          dataRequirements: ['Rating scales', 'Numeric values'],
          example: 'Customer satisfaction ratings'
        })
      }
      if (hasNumericData && dataQuality.range > 5) {
        recommendations.push({
          chartType: 'line',
          title: 'Line Chart',
          description: 'Shows rating trends over time',
          confidence: 0.80,
          reasoning: 'Good rating range for trend analysis',
          bestFor: ['Rating Trends', 'Performance Tracking'],
          dataRequirements: ['Rating data', 'Time series'],
          example: 'Satisfaction trends over time'
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

    case 'qualitative-analysis':
      return `This qualitative analysis examines ${sampleSize} data points across ${columns.length} variables, focusing on survey responses, feedback, and qualitative insights. The dataset includes ${categoricalCols.length} qualitative dimensions with text responses, ratings, and categorical feedback. The analysis reveals patterns in user sentiment, preferences, and qualitative feedback across ${categoricalCols.length} key areas. This comprehensive qualitative assessment provides insights into user experience, satisfaction levels, and areas for improvement based on direct feedback and survey responses.`

    case 'rating-analysis':
      return `This rating analysis examines ${sampleSize} data points across ${columns.length} rating scales, providing insights into satisfaction levels, performance ratings, and scale-based feedback. The dataset includes rating data ranging from 1 to 10, with average ratings of ${numericStats[0]?.avg?.toFixed(1) || 0} out of 10. The analysis reveals ${numericStats[0]?.avg > 7 ? 'high' : numericStats[0]?.avg > 5 ? 'moderate' : 'low'} satisfaction levels, with ratings distributed from ${numericStats[0]?.min?.toFixed(1) || 0} to ${numericStats[0]?.max?.toFixed(1) || 0}. This comprehensive rating assessment supports customer satisfaction analysis and service improvement strategies.`

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
      },
      {
        id: 'qualitative-analysis',
        title: 'Qualitative Data Analysis',
        description: 'Survey responses, feedback, and qualitative insights',
        dataGenerator: () => generateQualitativeChartData(data, analysis),
        chartTypes: ['bar', 'pie', 'doughnut']
      },
      {
        id: 'rating-analysis',
        title: 'Rating Scale Analysis',
        description: 'Customer satisfaction ratings and scale responses',
        dataGenerator: () => generateRatingChartData(data, analysis),
        chartTypes: ['bar', 'line', 'radar']
      }
    ]

    // Check if we have meaningful data to analyze
    const hasMeaningfulData = data && data.length > 0 && analysis && analysis.columns && analysis.columns.length > 0

    // Generate visualizations for each type
    visualizationTypes.forEach((vizType, index) => {
      const chartData = vizType.dataGenerator()
      
      // Only add visualization if we have meaningful data and valid chart data
      if (hasMeaningfulData && chartData && chartData.length > 0) {
        // Check if the chart data is not just sample data
        const isSampleData = chartData.every(item => 
          item.name && (
            item.name.includes('Category') || 
            item.name.includes('Sample') || 
            item.name.includes('Strongly Agree') ||
            item.name.includes('Very Satisfied')
          )
        )
        
        // Only add if it's not just sample data or if we have real data
        if (!isSampleData || data.length > 0) {
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
        {visualizations.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Visualizations Available</h3>
              <p className="text-gray-500 mb-4">
                No meaningful data patterns were detected to generate visualizations.
              </p>
              <p className="text-sm text-gray-400">
                Please ensure your data contains numeric values, categorical data, or time series information.
              </p>
            </div>
          </div>
        ) : (
          visualizations.map((visualization, index) => {
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
                <div 
                  className="h-72 border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white"
                  data-chart-id={visualization.id}
                >
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
        })
        )}
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

// Import enhanced data generation functions
import {
  generateBarChartData,
  generateLineChartData,
  generatePieChartData,
  generateDoughnutChartData,
  generateScatterPlotData,
  generateRadarChartData,
  generateGaugeChartData,
  generateQualitativeChartData,
  generateRatingChartData
} from './enhanced-data-generators'

// All data generation functions are now imported from enhanced-data-generators.ts