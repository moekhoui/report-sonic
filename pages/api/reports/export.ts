import { NextApiRequest, NextApiResponse } from 'next'
import { jsPDF } from 'jspdf'
import { AIChartGenerator } from '../../../src/lib/chartGenerator'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { report, rawData, headers } = req.body

    if (!report) {
      return res.status(400).json({ error: 'Report data is required' })
    }

    console.log('📄 Generating AI-powered PDF report with charts for:', report.name)

    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Add title and header
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('🤖 AI-Powered Report Analysis', 20, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 20

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

    // Add executive summary
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('📋 Executive Summary', 20, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    if (report.analysis?.summary) {
      const summaryLines = doc.splitTextToSize(report.analysis.summary, pageWidth - 40)
      summaryLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
      yPosition += 10
    }

    // Add charts and visualizations
    if (charts.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('📊 AI-Generated Data Visualizations', 20, yPosition)
      yPosition += 15

      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i]
        
        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          doc.addPage()
          yPosition = 20
        }

        // Add chart title
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(chart.config.title, 20, yPosition)
        yPosition += 8

        // Add chart type and description
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`📈 Chart Type: ${chart.config.type.toUpperCase()}`, 20, yPosition)
        yPosition += 6

        // Add chart insights
        const insightLines = doc.splitTextToSize(chart.insights, pageWidth - 40)
        insightLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 25, yPosition)
          yPosition += 5
        })
        yPosition += 15
      }
    }

    // Add detailed insights
    if (report.analysis?.insights && report.analysis.insights.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('🔍 AI Insights', 20, yPosition)
      yPosition += 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.insights.forEach((insight: string, index: number) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(`${index + 1}. ${insight}`, 20, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }

    // Add trends and patterns
    if (report.analysis?.trends && report.analysis.trends.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('📈 Trends & Patterns', 20, yPosition)
      yPosition += 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.trends.forEach((trend: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        const lines = doc.splitTextToSize(`• ${trend}`, pageWidth - 40)
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 25, yPosition)
          yPosition += 6
        })
        yPosition += 3
      })
      yPosition += 10
    }

    // Add data quality assessment
    if (report.analysis?.qualityIssues && report.analysis.qualityIssues.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('⚠️ Data Quality Assessment', 20, yPosition)
      yPosition += 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.qualityIssues.forEach((issue: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        const lines = doc.splitTextToSize(`• ${issue}`, pageWidth - 40)
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 25, yPosition)
          yPosition += 6
        })
        yPosition += 3
      })
      yPosition += 10
    }

    // Add AI recommendations
    if (report.analysis?.recommendations && report.analysis.recommendations.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('💡 AI Recommendations', 20, yPosition)
      yPosition += 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.recommendations.forEach((rec: string, index: number) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(`${index + 1}. ${rec}`, 20, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }

    // Add statistics summary
    if (report.analysis?.statistics && report.analysis.statistics.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('📊 Statistical Summary', 20, yPosition)
      yPosition += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.statistics.forEach((stat: any) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFont('helvetica', 'bold')
        doc.text(`${stat.column}:`, 20, yPosition)
        yPosition += 6
        
        doc.setFont('helvetica', 'normal')
        const statText = `Count: ${stat.count} | Avg: ${stat.average?.toFixed(2) || 'N/A'} | Min: ${stat.min || 'N/A'} | Max: ${stat.max || 'N/A'}`
        doc.text(statText, 25, yPosition)
        yPosition += 8
      })
    }

    // Add patterns section
    if (report.analysis?.patterns && report.analysis.patterns.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('🔍 Detected Patterns', 20, yPosition)
      yPosition += 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      report.analysis.patterns.forEach((pattern: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        const lines = doc.splitTextToSize(`• ${pattern}`, pageWidth - 40)
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 25, yPosition)
          yPosition += 6
        })
        yPosition += 3
      })
    }

    // Add footer to all pages
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Page ${i} of ${totalPages} | Generated by ReportSonic AI`, pageWidth - 60, pageHeight - 10)
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${report.name.replace(/\.[^/.]+$/, '')}_ai_report.pdf"`)
    res.setHeader('Content-Length', pdfBuffer.byteLength)

    // Send PDF
    res.status(200).send(Buffer.from(pdfBuffer))

  } catch (error: any) {
    console.error('❌ PDF export error:', error)
    return res.status(500).json({ 
      error: 'Failed to generate AI-powered PDF report' 
    })
  }
}