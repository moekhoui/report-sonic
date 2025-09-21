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
        
        console.log('📊 Generating REAL Chart.js images using AIChartGenerator...')
        const chartGenerator = new AIChartGenerator()
        const chartResults = await chartGenerator.generateMultiChartAnalysis(dataRows, dataHeaders, 5)
        
        charts = chartResults.map((result, index) => ({
          id: `chart-${index}`,
          title: result.config.title,
          type: result.config.type,
          data: result.config.data,
          options: result.config.options,
          insights: result.insights,
          image: result.image // This is the actual Chart.js generated image!
        }))
        
        console.log('📊 Generated REAL Chart.js images:', charts.length)
      }
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