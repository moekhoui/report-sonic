import { NextApiRequest, NextApiResponse } from 'next'
import { exportToPDF, exportToWord, exportToPowerPoint } from '../../../src/lib/export'

// Vercel-specific configuration
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { report, rawData, headers, format = 'pdf' } = req.body

    if (!report) {
      return res.status(400).json({ error: 'Report data is required' })
    }

    console.log(`📄 Generating AI-powered ${format.toUpperCase()} report for:`, report.name)

    // Generate charts using EXACT same logic as DataViewer
    let charts: any[] = []
    try {
      if (rawData && rawData.length > 1) {
        const headers = rawData[0]
        const dataRows = rawData.slice(1)
        
        // Detect column type function (EXACT copy from DataViewer)
        function detectColumnType(rows: any[][], columnIndex: number): 'numeric' | 'text' | 'date' {
          const sample = rows.slice(0, Math.min(10, rows.length)).map(row => row[columnIndex])
          
          // Check if all are numbers
          if (sample.every(val => !isNaN(Number(val)) && val !== '')) {
            return 'numeric'
          }
          
          // Check if all are dates
          if (sample.every(val => {
            const date = new Date(val)
            return !isNaN(date.getTime())
          })) {
            return 'date'
          }
          
          return 'text'
        }
        
        // Process data EXACTLY like DataViewer
        const processedColumns = headers.map((header: string, index: number) => ({
          key: header,
          index,
          type: detectColumnType(dataRows, index)
        }))
        
        // Generate charts EXACTLY like DataViewer
        processedColumns.forEach((column: { key: string; type: string; index: number }, index: number) => {
          if (column.type === 'numeric') {
            const values = dataRows
              .map((row: any[]) => Number(row[column.index]))
              .filter((val: number) => !isNaN(val))
              .slice(0, 50) // Limit for performance
            
            if (values.length > 0) {
              const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
              const min = Math.min(...values)
              const max = Math.max(...values)
              const stdDev = Math.sqrt(values.reduce((sum: number, val: number) => sum + Math.pow(val - avg, 2), 0) / values.length)
              
              // AI-generated insights based on actual data
              let insights = `This bar chart reveals the distribution pattern of ${column.key} values across ${values.length} data points. `
              if (max - min < avg * 0.1) {
                insights += `The data shows remarkable consistency with a narrow range (${min.toFixed(2)} - ${max.toFixed(2)}), indicating stable performance. `
              } else if (max > avg * 2) {
                insights += `Significant variability detected with extreme values reaching ${max.toFixed(2)}, suggesting potential outliers or diverse performance levels. `
              } else {
                insights += `Moderate variability observed with values ranging from ${min.toFixed(2)} to ${max.toFixed(2)}, showing balanced distribution. `
              }
              insights += `The average of ${avg.toFixed(2)} with a standard deviation of ${stdDev.toFixed(2)} indicates ${stdDev < avg * 0.2 ? 'low' : stdDev < avg * 0.5 ? 'moderate' : 'high'} data dispersion. This visualization is crucial for identifying trends, outliers, and performance patterns that drive strategic decision-making.`
              
              charts.push({
                id: `chart-${index}`,
                title: column.key,
                type: 'bar',
                data: {
                  labels: values.map((_: number, i: number) => `Point ${i + 1}`),
                  datasets: [{
                    label: column.key,
                    data: values,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `${column.key} Distribution`
                    }
                  }
                },
                insights: insights
              })
            }
          } else if (column.type === 'text') {
            const valueCounts: { [key: string]: number } = {}
            dataRows.forEach((row: any[]) => {
              const value = String(row[column.index] || '')
              if (value) {
                valueCounts[value] = (valueCounts[value] || 0) + 1
              }
            })
            
            const sortedEntries = Object.entries(valueCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10) // Top 10 values
            
            if (sortedEntries.length > 0) {
              const totalCount = sortedEntries.reduce((sum, [,count]) => sum + count, 0)
              const topValue = sortedEntries[0][0]
              const topCount = sortedEntries[0][1]
              const topPercentage = (topCount / totalCount) * 100
              const uniqueValues = sortedEntries.length
              
              // AI-generated insights based on actual data
              let insights = `This pie chart illustrates the categorical distribution of ${column.key} across ${totalCount} total entries. `
              if (topPercentage > 50) {
                insights += `The data shows strong concentration with "${topValue}" dominating at ${topPercentage.toFixed(1)}% of all entries, indicating a clear market leader or primary category. `
              } else if (topPercentage > 30) {
                insights += `Moderate concentration observed with "${topValue}" representing ${topPercentage.toFixed(1)}% of entries, suggesting a competitive landscape with a leading category. `
              } else {
                insights += `Highly diversified distribution with "${topValue}" at only ${topPercentage.toFixed(1)}% of entries, indicating fragmented market segments or balanced categories. `
              }
              insights += `The presence of ${uniqueValues} unique categories demonstrates ${uniqueValues > 5 ? 'high' : 'moderate'} diversity in this field. This visualization is essential for understanding market segmentation, customer preferences, and strategic positioning opportunities.`
              
              charts.push({
                id: `chart-${index}`,
                title: column.key,
                type: 'pie',
                data: {
                  labels: sortedEntries.map(([key]) => key),
                  datasets: [{
                    data: sortedEntries.map(([,count]) => count),
                    backgroundColor: [
                      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                    ]
                  }]
                },
                options: {
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `${column.key} Distribution`
                    }
                  }
                },
                insights: insights
              })
            }
          }
        })
      }
      console.log('📊 Generated EXACT DataViewer charts for export:', charts.length)
    } catch (chartError) {
      console.log('📊 Chart generation failed, continuing without charts:', chartError)
      charts = []
    }

    // Generate DYNAMIC AI introduction and conclusion based on actual data
    const totalRows = rawData ? rawData.length - 1 : 0
    const totalColumns = rawData ? rawData[0].length : 0
    const numericCharts = charts.filter(c => c.type === 'bar').length
    const categoricalCharts = charts.filter(c => c.type === 'pie').length
    
    // Calculate data quality metrics
    const dataQuality = totalRows > 0 ? {
      completeness: Math.round((rawData.flat().filter(cell => cell !== null && cell !== undefined && cell !== '').length / (totalRows * totalColumns)) * 100),
      diversity: categoricalCharts > 0 ? 'high' : 'moderate',
      volume: totalRows > 1000 ? 'large-scale' : totalRows > 100 ? 'medium-scale' : 'focused'
    } : { completeness: 0, diversity: 'unknown', volume: 'unknown' }
    
    // Generate dynamic AI introduction
    const aiIntroduction = `This comprehensive data analysis report presents AI-powered insights derived from ${totalRows} records across ${totalColumns} data fields. Our advanced analytical engine has processed ${dataQuality.volume} dataset with ${dataQuality.completeness}% data completeness, identifying ${numericCharts} numerical patterns and ${categoricalCharts} categorical distributions. The analysis reveals ${dataQuality.diversity} data diversity with ${charts.length} strategic visualizations that uncover hidden patterns, trends, and opportunities within your dataset. Each visualization is accompanied by AI-generated insights that translate complex data relationships into actionable business intelligence, enabling data-driven decision-making and strategic optimization.`
    
    // Generate dynamic AI conclusion with specific recommendations
    const keyInsights = charts.length > 0 ? [
      `${numericCharts} numerical metrics analyzed for performance patterns`,
      `${categoricalCharts} categorical segments identified for market positioning`,
      `${dataQuality.completeness}% data quality ensuring reliable insights`,
      `${charts.length} visualizations providing comprehensive data coverage`
    ] : ['Limited data available for comprehensive analysis']
    
    const aiConclusion = `Based on our comprehensive AI analysis of ${totalRows} data points, this report has revealed critical insights that can transform your business strategy. The analysis encompasses ${keyInsights.join(', ')}. Our AI-powered recommendations focus on leveraging these ${charts.length} key visualizations to optimize operational efficiency, identify market opportunities, and drive strategic growth. The data quality assessment shows ${dataQuality.completeness}% completeness, indicating ${dataQuality.completeness > 80 ? 'high reliability' : dataQuality.completeness > 60 ? 'moderate reliability' : 'areas for data improvement'}. We recommend implementing regular data monitoring, expanding successful patterns identified in the analysis, and using these insights to inform quarterly strategic reviews. The visualizations presented provide a foundation for executive decision-making and competitive advantage in your market segment.`

    // Prepare export options with safe defaults
    const exportOptions = {
      title: report.name || 'AI Report Analysis',
      companyName: 'ReportSonic AI',
      clientName: report.clientName || 'Client',
      content: report.analysis?.summary || 'AI-generated report content',
      analysis: {
        summary: report.analysis?.summary || 'No analysis summary available',
        insights: report.analysis?.insights || [],
        trends: report.analysis?.trends || [],
        recommendations: report.analysis?.recommendations || [],
        statistics: report.analysis?.statistics || [],
        patterns: report.analysis?.patterns || [],
        qualityIssues: report.analysis?.qualityIssues || []
      },
      charts: charts,
      aiIntroduction: aiIntroduction,
      aiConclusion: aiConclusion
    }

    console.log('📋 Export options prepared:', {
      title: exportOptions.title,
      hasAnalysis: !!exportOptions.analysis,
      hasSummary: !!exportOptions.analysis.summary,
      insightsCount: exportOptions.analysis.insights.length
    })

    let blob: Blob
    let filename: string
    let contentType: string

    // Generate the appropriate format
    try {
      switch (format.toLowerCase()) {
        case 'word':
          console.log('📝 Generating Word document...')
          blob = await exportToWord(exportOptions)
          filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.docx`
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case 'powerpoint':
        case 'ppt':
          console.log('📊 Generating PowerPoint presentation...')
          blob = await exportToPowerPoint(exportOptions)
          filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.pptx`
          contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          break
        case 'pdf':
        default:
          console.log('📄 Generating PDF document...')
          blob = await exportToPDF(exportOptions)
          filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.pdf`
          contentType = 'application/pdf'
          break
      }
      console.log(`✅ ${format.toUpperCase()} generation successful, size: ${blob.size} bytes`)
    } catch (exportError: any) {
      console.error(`❌ ${format.toUpperCase()} generation failed:`, exportError)
      throw new Error(`Failed to generate ${format.toUpperCase()} report: ${exportError.message}`)
    }

    // Convert blob to buffer
    const buffer = await blob.arrayBuffer()

    // Set response headers
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.byteLength)

    // Send file
    res.status(200).send(Buffer.from(buffer))

  } catch (error: any) {
    console.error(`❌ Export error:`, error)
    
    // Vercel-specific error handling
    if (error.message?.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Export timeout - please try again with smaller data' 
      })
    }
    
    if (error.message?.includes('memory')) {
      return res.status(413).json({ 
        error: 'Data too large - please reduce data size' 
      })
    }
    
    return res.status(500).json({ 
      error: `Failed to generate report: ${error.message || 'Unknown error'}` 
    })
  }
}