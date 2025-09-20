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

    // Skip chart generation completely to avoid errors
    let charts: any[] = []
    console.log('📊 Chart generation disabled for stability')

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