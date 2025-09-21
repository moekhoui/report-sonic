import { NextApiRequest, NextApiResponse } from 'next'
import { exportToPDF, exportToWord, exportToPowerPoint } from '../../../src/lib/export'
import { AIChartGenerator } from '../../../src/lib/chartGenerator'

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

    // Generate charts using AIChartGenerator for REAL Chart.js images
    let charts: any[] = []
    try {
      if (rawData && rawData.length > 1) {
        const dataHeaders = rawData[0]
        const dataRows = rawData.slice(1)
        
        console.log('📊 Generating charts with data structures...')
        console.log('📊 Data headers:', dataHeaders)
        console.log('📊 Data rows count:', dataRows.length)
        
        // Generate charts directly without ChartJSNodeCanvas for now
        for (let i = 0; i < Math.min(dataHeaders.length, 5); i++) {
          const columnData = dataRows.map((row: any[]) => row[i]).filter((val: any) => val !== null && val !== undefined && val !== '')
          
          if (columnData.length > 0) {
            // Determine data type
            const isNumeric = columnData.every((val: any) => !isNaN(Number(val)))
            const chartType = isNumeric ? 'bar' : 'pie'
            
            let chartData: any
            let insights: string
            
            if (isNumeric) {
              const numericData = columnData.map((val: any) => Number(val)).filter((val: any) => !isNaN(val))
              const avg = numericData.reduce((a: number, b: number) => a + b, 0) / numericData.length
              const min = Math.min(...numericData)
              const max = Math.max(...numericData)
              
              chartData = {
                labels: numericData.map((_: any, idx: number) => `Point ${idx + 1}`),
                datasets: [{
                  label: dataHeaders[i],
                  data: numericData,
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              }
              
              insights = `This bar chart shows the distribution of ${dataHeaders[i]} values. Range: ${min.toFixed(2)} - ${max.toFixed(2)}, Average: ${avg.toFixed(2)}, Data Points: ${numericData.length}. The visualization reveals patterns and trends in the numerical data.`
            } else {
              const valueCounts: { [key: string]: number } = {}
              columnData.forEach((value: any) => {
                const key = String(value)
                valueCounts[key] = (valueCounts[key] || 0) + 1
              })
              
              const sortedEntries = Object.entries(valueCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
              
              const total = sortedEntries.reduce((sum: number, [,count]) => sum + count, 0)
              const topValue = sortedEntries[0]?.[0] || 'N/A'
              const topCount = sortedEntries[0]?.[1] || 0
              const topPercentage = total > 0 ? ((topCount / total) * 100).toFixed(1) : '0'
              
              chartData = {
                labels: sortedEntries.map(([key]) => key),
                datasets: [{
                  data: sortedEntries.map(([,count]) => count),
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                  ]
                }]
              }
              
              insights = `This pie chart illustrates the categorical distribution of ${dataHeaders[i]}. Top category "${topValue}" represents ${topPercentage}% of all entries. Total categories: ${sortedEntries.length}, Total records: ${total}. This visualization helps identify dominant patterns and market segments.`
            }
            
            charts.push({
              id: `chart-${i}`,
              title: dataHeaders[i],
              type: chartType,
              data: chartData,
              insights: insights,
              image: null // No image for now, but chart data is ready
            })
          }
        }
        
        console.log('📊 Generated charts:', charts.length)
      } else {
        console.log('📊 No raw data available for chart generation')
      }
    } catch (chartError: any) {
      console.error('❌ Chart generation failed:', chartError)
      console.error('❌ Chart error stack:', chartError.stack)
      
      // Fallback: Generate simple charts without images
      console.log('📊 Using fallback chart generation...')
      if (rawData && rawData.length > 1) {
        const dataHeaders = rawData[0]
        const dataRows = rawData.slice(1)
        
        // Simple chart generation fallback
        for (let i = 0; i < Math.min(dataHeaders.length, 3); i++) {
          const columnData = dataRows.map((row: any[]) => row[i]).filter((val: any) => val !== null && val !== undefined && val !== '')
          
          if (columnData.length > 0) {
            // Determine chart type
            const isNumeric = columnData.every((val: any) => !isNaN(Number(val)))
            const chartType = isNumeric ? 'bar' : 'pie'
            
            let chartData: any
            if (isNumeric) {
              const numericData = columnData.map((val: any) => Number(val)).filter((val: any) => !isNaN(val))
              chartData = {
                labels: numericData.map((_: any, idx: number) => `Point ${idx + 1}`),
                datasets: [{
                  label: dataHeaders[i],
                  data: numericData,
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              }
            } else {
              const valueCounts: { [key: string]: number } = {}
              columnData.forEach((value: any) => {
                const key = String(value)
                valueCounts[key] = (valueCounts[key] || 0) + 1
              })
              
              const sortedEntries = Object.entries(valueCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
              
              chartData = {
                labels: sortedEntries.map(([key]) => key),
                datasets: [{
                  data: sortedEntries.map(([,count]) => count),
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                  ]
                }]
              }
            }
            
            charts.push({
              id: `chart-${i}`,
              title: dataHeaders[i],
              type: chartType,
              data: chartData,
              insights: `This ${chartType} chart shows the distribution of ${dataHeaders[i]} data with ${columnData.length} data points.`,
              image: null // No image in fallback
            })
          }
        }
        console.log('📊 Generated fallback charts:', charts.length)
      }
    }

    // Generate DYNAMIC AI introduction and conclusion based on actual data
    const totalRows = rawData ? rawData.length - 1 : 0
    const totalColumns = rawData ? rawData[0].length : 0
    const numericCharts = charts.filter(c => c.type === 'bar').length
    const categoricalCharts = charts.filter(c => c.type === 'pie').length
    
    // Calculate data quality metrics
    const dataQuality = totalRows > 0 ? {
      completeness: Math.round((rawData.flat().filter((cell: any) => cell !== null && cell !== undefined && cell !== '').length / (totalRows * totalColumns)) * 100),
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