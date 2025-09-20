import { Chart, ChartConfiguration, registerables } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

// Register Chart.js components
Chart.register(...registerables)

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }>
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter'
  title: string
  data: ChartData
  options?: any
}

export class AIChartGenerator {
  private chartJSNodeCanvas: any

  constructor() {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 800,
      height: 600,
      backgroundColour: 'white'
    })
  }

  // AI-powered chart type recommendation based on data analysis
  recommendChartType(data: any[], columnName: string, dataType: string): string {
    const uniqueValues = new Set(data.filter(d => d !== null && d !== undefined && d !== ''))
    const uniqueCount = uniqueValues.size
    const totalCount = data.length
    const uniqueRatio = uniqueCount / totalCount

    // Numeric data analysis
    if (dataType === 'numeric') {
      const numericData = data.filter(d => !isNaN(Number(d))).map(d => Number(d))
      
      if (numericData.length < 5) {
        return 'pie' // Small dataset - pie chart
      } else if (uniqueRatio < 0.1) {
        return 'bar' // Low cardinality - bar chart
      } else if (numericData.length > 20) {
        return 'line' // Large dataset - line chart for trends
      } else {
        return 'bar' // Default for numeric
      }
    }
    
    // Date data analysis
    if (dataType === 'date') {
      return 'line' // Dates are best shown as line charts
    }
    
    // Categorical data analysis
    if (dataType === 'text' || dataType === 'categorical') {
      if (uniqueCount <= 10) {
        return 'doughnut' // Small categories - doughnut chart
      } else if (uniqueCount <= 20) {
        return 'bar' // Medium categories - bar chart
      } else {
        return 'bar' // Many categories - bar chart (top 10)
      }
    }

    return 'bar' // Default fallback
  }

  // Generate chart configuration based on data and AI recommendations
  generateChartConfig(
    data: any[][], 
    headers: string[], 
    columnIndex: number, 
    chartType: string
  ): ChartConfig {
    const columnName = headers[columnIndex]
    const columnData = data.map(row => row[columnIndex]).filter(d => d !== null && d !== undefined && d !== '')
    
    // AI-powered data processing
    const processedData = this.processDataForChart(columnData, columnName, chartType)
    
    const baseConfig: ChartConfig = {
      type: chartType as any,
      title: `Analysis: ${columnName}`,
      data: processedData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `AI Analysis: ${columnName}`,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    }

    // Add chart-specific options
    if (chartType === 'line') {
      baseConfig.options.scales = {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Data Points'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: columnName
          }
        }
      }
    }

    return baseConfig
  }

  // Process data for different chart types
  private processDataForChart(data: any[], columnName: string, chartType: string): ChartData {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return this.processCategoricalData(data, columnName)
    } else if (chartType === 'line') {
      return this.processTimeSeriesData(data, columnName)
    } else if (chartType === 'bar') {
      return this.processBarChartData(data, columnName)
    } else {
      return this.processBarChartData(data, columnName) // Default
    }
  }

  // Process categorical data for pie/doughnut charts
  private processCategoricalData(data: any[], columnName: string): ChartData {
    const valueCounts: { [key: string]: number } = {}
    
    data.forEach(value => {
      const key = String(value)
      valueCounts[key] = (valueCounts[key] || 0) + 1
    })

    // Sort by count and take top 10
    const sortedEntries = Object.entries(valueCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    const colors = this.generateColors(sortedEntries.length)

    return {
      labels: sortedEntries.map(([key]) => key),
      datasets: [{
        label: columnName,
        data: sortedEntries.map(([,count]) => count),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')),
        borderWidth: 2
      }]
    }
  }

  // Process time series data for line charts
  private processTimeSeriesData(data: any[], columnName: string): ChartData {
    const numericData = data.filter(d => !isNaN(Number(d))).map(d => Number(d))
    
    return {
      labels: Array.from({ length: numericData.length }, (_, i) => `Point ${i + 1}`),
      datasets: [{
        label: columnName,
        data: numericData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
  }

  // Process data for bar charts
  private processBarChartData(data: any[], columnName: string): ChartData {
    const valueCounts: { [key: string]: number } = {}
    
    data.forEach(value => {
      const key = String(value)
      valueCounts[key] = (valueCounts[key] || 0) + 1
    })

    // Sort by count and take top 15
    const sortedEntries = Object.entries(valueCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)

    return {
      labels: sortedEntries.map(([key]) => key.length > 20 ? key.substring(0, 20) + '...' : key),
      datasets: [{
        label: columnName,
        data: sortedEntries.map(([,count]) => count),
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 1
      }]
    }
  }

  // Generate color palette
  private generateColors(count: number): string[] {
    const colors = [
      'rgba(59, 130, 246, 0.6)',   // Blue
      'rgba(16, 185, 129, 0.6)',   // Green
      'rgba(245, 101, 101, 0.6)',  // Red
      'rgba(251, 191, 36, 0.6)',   // Yellow
      'rgba(139, 92, 246, 0.6)',   // Purple
      'rgba(236, 72, 153, 0.6)',   // Pink
      'rgba(6, 182, 212, 0.6)',    // Cyan
      'rgba(34, 197, 94, 0.6)',    // Emerald
      'rgba(251, 146, 60, 0.6)',   // Orange
      'rgba(168, 85, 247, 0.6)'    // Violet
    ]

    const result = []
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length])
    }
    return result
  }

  // Generate chart image as base64
  async generateChartImage(config: ChartConfig): Promise<string> {
    try {
      const imageBuffer = await this.chartJSNodeCanvas.renderToBuffer(config as ChartConfiguration)
      return `data:image/png;base64,${imageBuffer.toString('base64')}`
    } catch (error) {
      console.error('Chart generation error:', error)
      throw new Error('Failed to generate chart image')
    }
  }

  // AI-powered multi-chart analysis
  async generateMultiChartAnalysis(
    data: any[][], 
    headers: string[], 
    maxCharts: number = 5
  ): Promise<Array<{ config: ChartConfig, image: string, insights: string }>> {
    const charts = []
    
    // Analyze each column and generate appropriate charts
    for (let i = 0; i < headers.length && charts.length < maxCharts; i++) {
      const columnData = data.map(row => row[i]).filter(d => d !== null && d !== undefined && d !== '')
      
      if (columnData.length === 0) continue

      // Determine data type
      const dataType = this.detectDataType(columnData)
      
      // Skip if not suitable for visualization
      if (dataType === 'unknown') continue

      // Get AI recommendation
      const chartType = this.recommendChartType(columnData, headers[i], dataType)
      
      // Generate chart config
      const config = this.generateChartConfig(data, headers, i, chartType)
      
      // Generate chart image
      const image = await this.generateChartImage(config)
      
      // Generate insights
      const insights = this.generateChartInsights(columnData, headers[i], dataType, chartType)
      
      charts.push({
        config,
        image,
        insights
      })
    }

    return charts
  }

  // Detect data type for AI analysis
  private detectDataType(data: any[]): string {
    if (data.length === 0) return 'unknown'

    const sample = data.slice(0, Math.min(10, data.length))
    
    // Check if all are numbers
    if (sample.every(d => !isNaN(Number(d)))) {
      return 'numeric'
    }
    
    // Check if all are dates
    if (sample.every(d => {
      const date = new Date(d)
      return !isNaN(date.getTime())
    })) {
      return 'date'
    }
    
    // Check if categorical (limited unique values)
    const uniqueValues = new Set(sample)
    if (uniqueValues.size <= 20) {
      return 'categorical'
    }
    
    return 'text'
  }

  // Generate AI insights for each chart
  private generateChartInsights(data: any[], columnName: string, dataType: string, chartType: string): string {
    const totalCount = data.length
    const uniqueCount = new Set(data).size
    
    let insights = `📊 **${columnName} Analysis**\n\n`
    
    if (dataType === 'numeric') {
      const numericData = data.map(d => Number(d)).filter(d => !isNaN(d))
      const avg = numericData.reduce((a, b) => a + b, 0) / numericData.length
      const min = Math.min(...numericData)
      const max = Math.max(...numericData)
      
      insights += `• **Range**: ${min.toFixed(2)} - ${max.toFixed(2)}\n`
      insights += `• **Average**: ${avg.toFixed(2)}\n`
      insights += `• **Data Points**: ${totalCount}\n`
      
      if (chartType === 'line') {
        insights += `• **Trend**: ${numericData[0] < numericData[numericData.length - 1] ? '📈 Increasing' : '📉 Decreasing'}\n`
      }
    } else {
      insights += `• **Unique Values**: ${uniqueCount}\n`
      insights += `• **Total Records**: ${totalCount}\n`
      insights += `• **Diversity**: ${((uniqueCount / totalCount) * 100).toFixed(1)}%\n`
    }
    
    insights += `\n**Chart Type**: ${chartType.toUpperCase()} - ${this.getChartTypeDescription(chartType)}`
    
    return insights
  }

  private getChartTypeDescription(chartType: string): string {
    const descriptions: { [key: string]: string } = {
      'bar': 'Best for comparing categories',
      'line': 'Ideal for showing trends over time',
      'pie': 'Perfect for showing proportions',
      'doughnut': 'Great for highlighting key segments',
      'scatter': 'Excellent for correlation analysis'
    }
    return descriptions[chartType] || 'Suitable for this data type'
  }
}
