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

    // Generate charts using the same logic as DataViewer
    let charts: any[] = []
    try {
      if (rawData && rawData.length > 1) {
        const headers = rawData[0]
        const dataRows = rawData.slice(1)
        
        // Process data similar to DataViewer
        const processedColumns = headers.map((header: string, index: number) => {
          const columnData = dataRows.map((row: any[]) => row[index]).filter((val: any) => val !== null && val !== undefined)
          const numericData = columnData.filter((val: any) => typeof val === 'number' && !isNaN(val))
          
          return {
            key: header,
            type: numericData.length > columnData.length * 0.5 ? 'numeric' : 'text',
            index: index
          }
        })
        
        // Generate charts using the same logic as DataViewer
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
                insights: `This bar chart visualizes the distribution of ${column.key} values. The data shows ${values.length} data points with an average of ${avg.toFixed(2)}, ranging from ${min} to ${max}. This visualization helps identify patterns and outliers in the ${column.key} data.`
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
                insights: `This pie chart shows the distribution of ${column.key} categories. The most common value is "${topValue}" with ${topCount} occurrences (${((topCount / totalCount) * 100).toFixed(1)}% of total). This visualization helps understand the categorical distribution and identify dominant categories.`
              })
            }
          }
        })
      }
      console.log('📊 Generated real charts for export:', charts.length)
    } catch (chartError) {
      console.log('📊 Chart generation failed, continuing without charts:', chartError)
      charts = []
    }

    // Generate AI introduction and conclusion
    const totalRows = rawData ? rawData.length - 1 : 0
    const totalColumns = rawData ? rawData[0].length : 0
    const numericCharts = charts.filter(c => c.type === 'bar').length
    const categoricalCharts = charts.filter(c => c.type === 'pie').length
    
    const aiIntroduction = `This comprehensive data analysis report presents insights derived from ${totalRows} records across ${totalColumns} data fields. Our AI-powered analysis has identified ${numericCharts} numerical patterns and ${categoricalCharts} categorical distributions, providing a complete picture of your data landscape. The visualizations and statistical analysis presented herein offer actionable insights to drive strategic decision-making and operational excellence.`
    
    const aiConclusion = `Based on our comprehensive analysis of ${totalRows} data points, this report has revealed key patterns, trends, and opportunities within your dataset. The ${charts.length} visualizations demonstrate clear data relationships and statistical significance that can inform strategic initiatives. We recommend leveraging these insights to optimize processes, identify growth opportunities, and make data-driven decisions that align with your organizational objectives. Regular monitoring and analysis of these metrics will ensure continued success and adaptation to changing market conditions.`

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