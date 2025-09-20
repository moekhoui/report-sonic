import { NextApiRequest, NextApiResponse } from 'next'
import { exportToPDF, exportToWord, exportToPowerPoint } from '../../../src/lib/export'
import { AIChartGenerator } from '../../../src/lib/chartGenerator'

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

    // Generate AI-powered charts if raw data is available
    let charts: any[] = []
    if (rawData && headers && rawData.length > 0) {
      try {
        console.log('📊 Generating AI-powered charts...')
        const chartGenerator = new AIChartGenerator()
        charts = await chartGenerator.generateMultiChartAnalysis(rawData, headers, 4)
        console.log(`✅ Generated ${charts.length} AI-powered charts`)
      } catch (error) {
        console.error('❌ Chart generation error:', error)
        // Continue without charts if generation fails
      }
    }

    // Prepare export options
    const exportOptions = {
      title: report.name || 'AI Report Analysis',
      companyName: 'ReportSonic AI',
      clientName: report.clientName,
      content: report.analysis?.summary || 'AI-generated report content',
      analysis: report.analysis,
      charts: charts
    }

    let blob: Blob
    let filename: string
    let contentType: string

    // Generate the appropriate format
    switch (format.toLowerCase()) {
      case 'word':
        blob = await exportToWord(exportOptions)
        filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.docx`
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'powerpoint':
      case 'ppt':
        blob = await exportToPowerPoint(exportOptions)
        filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.pptx`
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        break
      case 'pdf':
      default:
        blob = await exportToPDF(exportOptions)
        filename = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.pdf`
        contentType = 'application/pdf'
        break
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
    return res.status(500).json({ 
      error: `Failed to generate AI-powered report` 
    })
  }
}