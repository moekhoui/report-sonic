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
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'area' | 'radar' | 'box' | 'heatmap' | 'waterfall' | 'sankey'
  title: string
  data: ChartData
  options?: any
  xAxisLabel?: string
  yAxisLabel?: string
  description?: string
  insights?: string
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

  // Enhanced AI-powered chart type recommendation with business context
  recommendChartType(data: any[], columnName: string, dataType: string, context?: any): string {
    const uniqueValues = new Set(data.filter(d => d !== null && d !== undefined && d !== ''))
    const uniqueCount = uniqueValues.size
    const totalCount = data.length
    const uniqueRatio = uniqueCount / totalCount

    // Enhanced chart type selection based on data characteristics and business context
    if (dataType === 'numeric') {
      const numericData = data.filter(d => !isNaN(Number(d))).map(d => Number(d))
      
      // Check for correlation potential (scatter plot)
      if (context && context.hasMultipleNumericColumns && numericData.length > 10) {
        return 'scatter'
      }
      
      // Check for distribution analysis (box plot)
      if (numericData.length > 20 && uniqueRatio > 0.8) {
        return 'box'
      }
      
      // Check for cumulative data (area chart)
      if (context && context.isTimeSeries && numericData.length > 10) {
        return 'area'
      }
      
      // Check for trend analysis (line chart)
      if (numericData.length > 15) {
        return 'line'
      }
      
      // Small dataset - bar chart
      if (numericData.length < 10) {
        return 'bar'
      }
      
      return 'bar' // Default for numeric
    }
    
    // Date data analysis
    if (dataType === 'date') {
      return 'line' // Dates are best shown as line charts
    }
    
    // Categorical data analysis
    if (dataType === 'text' || dataType === 'categorical') {
      // Check for multi-dimensional analysis (radar chart)
      if (context && context.isMultiDimensional && uniqueCount <= 8) {
        return 'radar'
      }
      
      // Check for heatmap potential
      if (context && context.hasMultipleCategories && uniqueCount > 5 && uniqueCount < 20) {
        return 'heatmap'
      }
      
      // Small categories - pie/doughnut chart
      if (uniqueCount <= 8) {
        return 'doughnut'
      }
      
      // Medium categories - bar chart
      if (uniqueCount <= 20) {
        return 'bar'
      }
      
      return 'bar' // Many categories - bar chart (top 10)
    }

    return 'bar' // Default fallback
  }

  // Enhanced chart configuration with business insights and proper axis labeling
  generateChartConfig(
    data: any[][], 
    headers: string[], 
    columnIndex: number, 
    chartType: string,
    context?: any
  ): ChartConfig {
    const columnName = headers[columnIndex]
    const columnData = data.map(row => row[columnIndex]).filter(d => d !== null && d !== undefined && d !== '')
    
    // AI-powered data processing
    const processedData = this.processDataForChart(columnData, columnName, chartType)
    
    // Generate business-focused insights
    const insights = this.generateBusinessInsights(columnData, columnName, chartType, context)
    
    // Determine proper axis labels
    const axisLabels = this.determineAxisLabels(columnName, chartType, context)
    
    const baseConfig: ChartConfig = {
      type: chartType as any,
      title: `${columnName} Analysis`,
      data: processedData,
      xAxisLabel: axisLabels.xAxis,
      yAxisLabel: axisLabels.yAxis,
      description: insights.description,
      insights: insights.businessInsight,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${columnName} - ${chartType.toUpperCase()} Chart`,
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#1f2937'
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1
          }
        }
      }
    }

    // Add chart-specific options with proper axis labeling
    if (chartType === 'line' || chartType === 'area') {
      baseConfig.options.scales = {
        x: {
          display: true,
          title: {
            display: true,
            text: axisLabels.xAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: axisLabels.yAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    } else if (chartType === 'bar') {
      baseConfig.options.scales = {
        x: {
          display: true,
          title: {
            display: true,
            text: axisLabels.xAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: axisLabels.yAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    } else if (chartType === 'scatter') {
      baseConfig.options.scales = {
        x: {
          display: true,
          title: {
            display: true,
            text: axisLabels.xAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: axisLabels.yAxis,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
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

  // Generate business-focused insights using your framework
  private generateBusinessInsights(data: any[], columnName: string, chartType: string, context?: any): {
    description: string
    businessInsight: string
  } {
    const totalCount = data.length
    const uniqueCount = new Set(data).size
    
    let description = ''
    let businessInsight = ''
    
    if (chartType === 'bar') {
      const numericData = data.filter(d => !isNaN(Number(d))).map(d => Number(d))
      if (numericData.length > 0) {
        const maxValue = Math.max(...numericData)
        const minValue = Math.min(...numericData)
        const avgValue = numericData.reduce((a, b) => a + b, 0) / numericData.length
        
        description = `This bar chart visualizes the distribution of ${columnName} values across ${totalCount} data points, showing the range from ${minValue} to ${maxValue} with an average of ${avgValue.toFixed(2)}.`
        
        businessInsight = `${columnName} shows a ${maxValue - minValue > avgValue * 2 ? 'high' : 'moderate'} variation with ${numericData.length} data points. ${maxValue > avgValue * 1.5 ? 'Peak values suggest significant opportunities' : 'Consistent values indicate stable performance'}. Recommendation: ${maxValue > avgValue * 1.5 ? 'Investigate high-performing segments and replicate success' : 'Focus on optimization and efficiency improvements'}.`
      }
    } else if (chartType === 'line') {
      const numericData = data.filter(d => !isNaN(Number(d))).map(d => Number(d))
      if (numericData.length > 1) {
        const trend = numericData[numericData.length - 1] > numericData[0] ? 'increasing' : 'decreasing'
        const changePercent = ((numericData[numericData.length - 1] - numericData[0]) / numericData[0] * 100).toFixed(1)
        
        description = `This line chart displays the trend of ${columnName} over ${totalCount} data points, showing a ${trend} pattern with ${changePercent}% change.`
        
        businessInsight = `${columnName} shows a ${trend} trend of ${changePercent}% over the period. This ${trend === 'increasing' ? 'growth indicates positive momentum' : 'decline requires immediate attention'}. Recommendation: ${trend === 'increasing' ? 'Sustain current strategies and scale successful initiatives' : 'Implement corrective measures and investigate root causes'}.`
      }
    } else if (chartType === 'pie' || chartType === 'doughnut') {
      const valueCounts: { [key: string]: number } = {}
      data.forEach(value => {
        const key = String(value)
        valueCounts[key] = (valueCounts[key] || 0) + 1
      })
      const sortedEntries = Object.entries(valueCounts).sort(([,a], [,b]) => b - a)
      const topValue = sortedEntries[0]
      const topPercentage = ((topValue[1] / totalCount) * 100).toFixed(1)
      
      description = `This ${chartType} chart shows the distribution of ${columnName} categories, with ${uniqueCount} distinct values across ${totalCount} total records.`
      
      businessInsight = `The dominant category "${topValue[0]}" represents ${topPercentage}% of all ${columnName} data. This ${topPercentage > 50 ? 'concentration suggests market dominance' : 'distribution indicates market diversity'}. Recommendation: ${topPercentage > 50 ? 'Leverage dominant position and explore expansion opportunities' : 'Analyze underperforming categories and develop targeted strategies'}.`
    } else if (chartType === 'scatter') {
      description = `This scatter plot reveals the relationship between ${columnName} and other variables, showing correlation patterns across ${totalCount} data points.`
      
      businessInsight = `The scatter plot shows ${totalCount} data points with ${uniqueCount} unique values. This visualization helps identify ${context?.hasMultipleNumericColumns ? 'correlation patterns and potential causal relationships' : 'data distribution and outlier patterns'}. Recommendation: ${context?.hasMultipleNumericColumns ? 'Investigate strong correlations for strategic insights' : 'Focus on outlier analysis and data quality improvement'}.`
    }
    
    return { description, businessInsight }
  }
  
  // Determine proper axis labels based on chart type and context
  private determineAxisLabels(columnName: string, chartType: string, context?: any): {
    xAxis: string
    yAxis: string
  } {
    let xAxis = 'Categories'
    let yAxis = columnName
    
    if (chartType === 'line' || chartType === 'area') {
      xAxis = context?.isTimeSeries ? 'Time Period' : 'Data Points'
      yAxis = `${columnName} Value`
    } else if (chartType === 'bar') {
      xAxis = 'Categories'
      yAxis = `${columnName} Count/Value`
    } else if (chartType === 'scatter') {
      xAxis = context?.xAxisColumn || 'X-Axis Variable'
      yAxis = `${columnName} (Y-Axis)`
    } else if (chartType === 'pie' || chartType === 'doughnut') {
      xAxis = 'Categories'
      yAxis = 'Percentage'
    }
    
    return { xAxis, yAxis }
  }

  private getChartTypeDescription(chartType: string): string {
    const descriptions: { [key: string]: string } = {
      'bar': 'Best for comparing categories',
      'line': 'Ideal for showing trends over time',
      'pie': 'Perfect for showing proportions',
      'doughnut': 'Great for highlighting key segments',
      'scatter': 'Excellent for correlation analysis',
      'area': 'Perfect for cumulative data visualization',
      'radar': 'Ideal for multi-dimensional comparison',
      'box': 'Best for distribution analysis',
      'heatmap': 'Great for pattern recognition',
      'waterfall': 'Perfect for showing changes',
      'sankey': 'Ideal for flow visualization'
    }
    return descriptions[chartType] || 'Suitable for this data type'
  }
}
