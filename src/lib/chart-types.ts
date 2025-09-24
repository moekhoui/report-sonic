// Comprehensive Chart.js chart types and AI recommendations for Report Sonic

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'doughnut' 
  | 'polarArea' 
  | 'radar' 
  | 'scatter' 
  | 'bubble' 
  | 'area' 
  | 'mixed' 
  | 'gauge' 
  | 'funnel' 
  | 'waterfall' 
  | 'treemap' 
  | 'heatmap' 
  | 'boxplot' 
  | 'histogram' 
  | 'candlestick' 
  | 'sankey' 
  | 'sunburst' 
  | 'wordcloud' 
  | 'network' 
  | 'timeline' 
  | 'geo' 
  | '3d'

export interface ChartRecommendation {
  chartType: ChartType
  title: string
  description: string
  confidence: number // 0-1
  reasoning: string
  dataRequirements: string[]
  bestFor: string[]
  example: string
}

export interface DataAnalysis {
  columns: string[]
  dataTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'>
  hasTimeSeries: boolean
  hasCategories: boolean
  hasGeographic: boolean
  hasNumeric: boolean
  hasText: boolean
  sampleSize: number
  dataQuality: {
    completeness: number
    consistency: number
    accuracy: number
  }
}

// AI-powered chart recommendation engine
export function analyzeDataForCharts(data: any[]): DataAnalysis {
  if (!data || data.length === 0) {
    return {
      columns: [],
      dataTypes: {},
      hasTimeSeries: false,
      hasCategories: false,
      hasGeographic: false,
      hasNumeric: false,
      hasText: false,
      sampleSize: 0,
      dataQuality: { completeness: 0, consistency: 0, accuracy: 0 }
    }
  }

  const columns = Object.keys(data[0])
  const dataTypes: Record<string, 'string' | 'number' | 'date' | 'boolean'> = {}
  let hasTimeSeries = false
  let hasCategories = false
  let hasGeographic = false
  let hasNumeric = false
  let hasText = false

  // Analyze each column
  columns.forEach(column => {
    const sampleValues = data.slice(0, 10).map(row => row[column]).filter(val => val != null)
    const dataType = inferDataType(sampleValues)
    dataTypes[column] = dataType

    // Check for specific patterns
    if (isDateColumn(column, sampleValues)) {
      hasTimeSeries = true
    }
    if (isGeographicColumn(column, sampleValues)) {
      hasGeographic = true
    }
    if (dataType === 'number') {
      hasNumeric = true
    }
    if (dataType === 'string' && isCategorical(sampleValues)) {
      hasCategories = true
    }
    if (dataType === 'string') {
      hasText = true
    }
  })

  return {
    columns,
    dataTypes,
    hasTimeSeries,
    hasCategories,
    hasGeographic,
    hasNumeric,
    hasText,
    sampleSize: data.length,
    dataQuality: calculateDataQuality(data)
  }
}

export function getChartRecommendations(analysis: DataAnalysis): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = []

  // Time Series Charts
  if (analysis.hasTimeSeries && analysis.hasNumeric) {
    recommendations.push({
      chartType: 'line',
      title: 'Time Series Trend',
      description: 'Shows how values change over time',
      confidence: 0.95,
      reasoning: 'Perfect for showing trends and patterns over time',
      dataRequirements: ['Date column', 'Numeric values'],
      bestFor: ['Sales trends', 'Performance metrics', 'Growth analysis'],
      example: 'Monthly sales revenue over 12 months'
    })

    recommendations.push({
      chartType: 'area',
      title: 'Area Chart',
      description: 'Shows cumulative values over time with filled areas',
      confidence: 0.85,
      reasoning: 'Great for showing volume and trends simultaneously',
      dataRequirements: ['Date column', 'Numeric values'],
      bestFor: ['Cumulative data', 'Volume analysis', 'Market share'],
      example: 'Website traffic growth over time'
    })
  }

  // Categorical Charts
  if (analysis.hasCategories && analysis.hasNumeric) {
    recommendations.push({
      chartType: 'bar',
      title: 'Bar Chart',
      description: 'Compares values across different categories',
      confidence: 0.9,
      reasoning: 'Excellent for comparing discrete categories',
      dataRequirements: ['Category column', 'Numeric values'],
      bestFor: ['Sales by region', 'Product performance', 'Survey results'],
      example: 'Sales by product category'
    })

    recommendations.push({
      chartType: 'pie',
      title: 'Pie Chart',
      description: 'Shows parts of a whole as percentages',
      confidence: 0.8,
      reasoning: 'Best for showing proportional relationships',
      dataRequirements: ['Category column', 'Numeric values'],
      bestFor: ['Market share', 'Budget allocation', 'Demographics'],
      example: 'Market share by region'
    })

    recommendations.push({
      chartType: 'doughnut',
      title: 'Doughnut Chart',
      description: 'Pie chart with a hollow center for additional information',
      confidence: 0.75,
      reasoning: 'Good alternative to pie charts with space for center labels',
      dataRequirements: ['Category column', 'Numeric values'],
      bestFor: ['Market share', 'Budget breakdown', 'Survey responses'],
      example: 'Customer segment distribution'
    })

    recommendations.push({
      chartType: 'polarArea',
      title: 'Polar Area Chart',
      description: 'Combines pie and bar chart characteristics',
      confidence: 0.7,
      reasoning: 'Unique visualization for categorical data with magnitude',
      dataRequirements: ['Category column', 'Numeric values'],
      bestFor: ['Performance metrics', 'Survey ratings', 'Multi-dimensional data'],
      example: 'Employee satisfaction by department'
    })
  }

  // Multi-dimensional Charts
  if (analysis.hasCategories && analysis.columns.length >= 3) {
    recommendations.push({
      chartType: 'radar',
      title: 'Radar Chart',
      description: 'Shows multiple variables on axes radiating from center',
      confidence: 0.8,
      reasoning: 'Perfect for comparing multiple metrics across categories',
      dataRequirements: ['Category column', 'Multiple numeric columns'],
      bestFor: ['Performance comparison', 'Product analysis', 'Skills assessment'],
      example: 'Product features comparison'
    })
  }

  // Scatter and Correlation
  if (analysis.hasNumeric && analysis.columns.filter(col => analysis.dataTypes[col] === 'number').length >= 2) {
    recommendations.push({
      chartType: 'scatter',
      title: 'Scatter Plot',
      description: 'Shows relationship between two numeric variables',
      confidence: 0.9,
      reasoning: 'Best for identifying correlations and patterns',
      dataRequirements: ['Two numeric columns'],
      bestFor: ['Correlation analysis', 'Outlier detection', 'Trend identification'],
      example: 'Sales vs Marketing spend correlation'
    })

    recommendations.push({
      chartType: 'bubble',
      title: 'Bubble Chart',
      description: 'Scatter plot with size representing third dimension',
      confidence: 0.8,
      reasoning: 'Great for showing three dimensions of data',
      dataRequirements: ['Two numeric columns', 'Size dimension'],
      bestFor: ['Market analysis', 'Performance comparison', 'Risk assessment'],
      example: 'Revenue vs Profit with Market Size'
    })
  }

  // Geographic Charts - Use bar chart instead of unsupported geo
  if (analysis.hasGeographic) {
    recommendations.push({
      chartType: 'bar',
      title: 'Geographic Distribution',
      description: 'Shows data distribution across geographic regions',
      confidence: 0.85,
      reasoning: 'Bar chart is perfect for comparing geographic regions',
      dataRequirements: ['Geographic column', 'Numeric values'],
      bestFor: ['Regional sales', 'Market penetration', 'Demographic analysis'],
      example: 'Sales by country/region'
    })
  }

  // Advanced Charts
  if (analysis.hasNumeric && analysis.sampleSize > 50) {
    recommendations.push({
      chartType: 'bar',
      title: 'Data Distribution',
      description: 'Shows distribution of numeric data',
      confidence: 0.8,
      reasoning: 'Bar chart is perfect for understanding data distribution patterns',
      dataRequirements: ['Numeric column'],
      bestFor: ['Data distribution', 'Statistical analysis', 'Quality control'],
      example: 'Customer age distribution'
    })

    recommendations.push({
      chartType: 'scatter',
      title: 'Statistical Analysis',
      description: 'Shows statistical distribution and relationships',
      confidence: 0.75,
      reasoning: 'Scatter plot is excellent for statistical analysis and outlier detection',
      dataRequirements: ['Numeric column', 'Optional category column'],
      bestFor: ['Statistical analysis', 'Outlier detection', 'Data comparison'],
      example: 'Sales performance by region'
    })
  }

  // Specialized Charts
  if (analysis.hasCategories && analysis.hasNumeric) {
    recommendations.push({
      chartType: 'funnel',
      title: 'Funnel Chart',
      description: 'Shows stages in a process with decreasing values',
      confidence: 0.7,
      reasoning: 'Perfect for conversion funnels and process analysis',
      dataRequirements: ['Process stages', 'Conversion values'],
      bestFor: ['Sales funnel', 'User journey', 'Process optimization'],
      example: 'Lead to customer conversion funnel'
    })

    recommendations.push({
      chartType: 'waterfall',
      title: 'Waterfall Chart',
      description: 'Shows cumulative effect of sequential values',
      confidence: 0.7,
      reasoning: 'Great for showing how values build up or break down',
      dataRequirements: ['Sequential categories', 'Numeric values'],
      bestFor: ['Financial analysis', 'Budget breakdown', 'Profit analysis'],
      example: 'Monthly profit/loss breakdown'
    })
  }

  // Heatmap for large datasets
  if (analysis.sampleSize > 100 && analysis.hasCategories && analysis.hasNumeric) {
    recommendations.push({
      chartType: 'heatmap',
      title: 'Heatmap',
      description: 'Shows data density using color intensity',
      confidence: 0.8,
      reasoning: 'Excellent for large datasets with patterns',
      dataRequirements: ['Two categorical columns', 'Numeric values'],
      bestFor: ['Pattern identification', 'Large dataset analysis', 'Correlation matrix'],
      example: 'Sales performance by region and product'
    })
  }

  // Sort by confidence and return top recommendations
  return recommendations.sort((a, b) => b.confidence - a.confidence)
}

// Helper functions
function inferDataType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  if (values.length === 0) return 'string'
  
  const firstValue = values[0]
  
  if (typeof firstValue === 'boolean') return 'boolean'
  if (typeof firstValue === 'number') return 'number'
  if (firstValue instanceof Date) return 'date'
  if (typeof firstValue === 'string') {
    // Check if it's a date string
    if (!isNaN(Date.parse(firstValue))) return 'date'
    // Check if it's a number string
    if (!isNaN(Number(firstValue))) return 'number'
  }
  
  return 'string'
}

function isDateColumn(columnName: string, values: any[]): boolean {
  const dateKeywords = ['date', 'time', 'created', 'updated', 'timestamp']
  const hasDateKeyword = dateKeywords.some(keyword => 
    columnName.toLowerCase().includes(keyword)
  )
  
  if (hasDateKeyword) return true
  
  // Check if values look like dates
  const dateLikeValues = values.filter(val => {
    if (val instanceof Date) return true
    if (typeof val === 'string' && !isNaN(Date.parse(val))) return true
    return false
  })
  
  return dateLikeValues.length > values.length * 0.8
}

function isGeographicColumn(columnName: string, values: any[]): boolean {
  const geoKeywords = ['country', 'region', 'state', 'city', 'location', 'address', 'lat', 'lng', 'longitude', 'latitude']
  const hasGeoKeyword = geoKeywords.some(keyword => 
    columnName.toLowerCase().includes(keyword)
  )
  
  return hasGeoKeyword
}

function isCategorical(values: any[]): boolean {
  const uniqueValues = new Set(values)
  return uniqueValues.size < values.length * 0.5 && uniqueValues.size < 20
}

function calculateDataQuality(data: any[]): { completeness: number; consistency: number; accuracy: number } {
  if (data.length === 0) return { completeness: 0, consistency: 0, accuracy: 0 }
  
  const columns = Object.keys(data[0])
  let totalCells = data.length * columns.length
  let emptyCells = 0
  let inconsistentTypes = 0
  
  columns.forEach(column => {
    const values = data.map(row => row[column])
    const firstType = typeof values[0]
    
    values.forEach(value => {
      if (value == null || value === '') emptyCells++
      if (typeof value !== firstType) inconsistentTypes++
    })
  })
  
  const completeness = Math.max(0, 1 - (emptyCells / totalCells))
  const consistency = Math.max(0, 1 - (inconsistentTypes / totalCells))
  const accuracy = (completeness + consistency) / 2 // Simplified accuracy metric
  
  return { completeness, consistency, accuracy }
}

// Chart configuration templates
export const CHART_CONFIGS: Record<ChartType, any> = {
  bar: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  line: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    },
    scales: {
      x: { type: 'linear' },
      y: { type: 'linear' }
    }
  },
  pie: {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true }
    }
  },
  doughnut: {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true }
    }
  },
  polarArea: {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true }
    }
  },
  radar: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  scatter: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    },
    scales: {
      x: { type: 'linear' },
      y: { type: 'linear' }
    }
  },
  bubble: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    },
    scales: {
      x: { type: 'linear' },
      y: { type: 'linear' }
    }
  },
  area: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    },
    scales: {
      x: { type: 'linear' },
      y: { type: 'linear' }
    }
  },
  mixed: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  gauge: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  funnel: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  waterfall: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  treemap: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  heatmap: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  boxplot: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  histogram: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  candlestick: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  sankey: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  sunburst: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  wordcloud: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  network: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  timeline: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  geo: {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  },
  '3d': {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true }
    }
  }
}
