import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import PptxGenJS from 'pptxgenjs'

export interface ExportOptions {
  title: string
  companyName: string
  clientName?: string
  content: string
  analysis?: {
    summary?: string
    insights?: string[]
    trends?: string[]
    recommendations?: string[]
    statistics?: any[]
    patterns?: string[]
    qualityIssues?: string[]
  }
  charts?: Array<{
    id: string
    type: string
    data: any[]
    title?: string
    insights?: string
  }>
}

export async function exportToPDF(options: ExportOptions): Promise<Blob> {
  try {
    const { title, companyName, clientName, content, analysis, charts } = options
    
    // Create a new PDF document with error handling
    let doc: any
    try {
      doc = new jsPDF('p', 'mm', 'a4')
    } catch (jsPDFError) {
      console.error('jsPDF initialization error:', jsPDFError)
      throw new Error('Failed to initialize PDF generator')
    }
    
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20
    
    // Add title and header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
    doc.text('AI-Powered Report Analysis', 20, yPosition)
    yPosition += 15
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 10
    
    doc.text(`Company: ${companyName}`, 20, yPosition)
    yPosition += 8
  if (clientName) {
      doc.text(`Client: ${clientName}`, 20, yPosition)
      yPosition += 8
    }
    yPosition += 15
    
    // Add executive summary
    if (analysis?.summary) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Executive Summary', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const summaryLines = doc.splitTextToSize(analysis.summary, pageWidth - 40)
      summaryLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
      yPosition += 15
    }
    
    // Add insights
    if (analysis?.insights && analysis.insights.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Key Insights', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      analysis.insights.forEach((insight: string, index: number) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(`${index + 1}. ${insight}`, 20, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }
    
    // Add recommendations
    if (analysis?.recommendations && analysis.recommendations.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Recommendations', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      analysis.recommendations.forEach((rec: string, index: number) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(`${index + 1}. ${rec}`, 20, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }
    
    // Add statistics
    if (analysis?.statistics && analysis.statistics.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Statistical Summary', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      analysis.statistics.forEach((stat: any) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFont('helvetica', 'bold')
        doc.text(`${stat.column}:`, 20, yPosition)
        yPosition += 6
        
        doc.setFont('helvetica', 'normal')
        const avgValue = typeof stat.average === 'number' ? stat.average.toFixed(2) : 'N/A'
        const statText = `Count: ${stat.count} | Avg: ${avgValue} | Min: ${stat.min || 'N/A'} | Max: ${stat.max || 'N/A'}`
        doc.text(statText, 25, yPosition)
        yPosition += 8
      })
    }

    // Add AI-generated chart explanations
    if (charts && charts.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('📈 AI-Generated Visualizations', 20, yPosition)
      yPosition += 15
      
  doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      charts.forEach((chart: any, index: number) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFont('helvetica', 'bold')
        doc.text(`Chart ${index + 1}: ${chart.title}`, 20, yPosition)
        yPosition += 8
        
        doc.setFont('helvetica', 'normal')
        const chartExplanation = `This ${chart.type} chart visualizes the ${chart.title} data. The chart type was selected by AI based on the data characteristics and provides insights into patterns and trends within the dataset.`
        const explanationLines = doc.splitTextToSize(chartExplanation, pageWidth - 40)
        explanationLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 25, yPosition)
          yPosition += 6
        })
        yPosition += 10
      })
    }
    
    // Add charts section
    if (charts && charts.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Data Visualizations', 20, yPosition)
      yPosition += 15
      
      charts.forEach((chart, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${chart.title}`, 20, yPosition)
        yPosition += 8
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        // Add chart description
        if (chart.insights) {
          const insightLines = doc.splitTextToSize(chart.insights, pageWidth - 40)
          insightLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, 25, yPosition)
            yPosition += 5
          })
        }
        
        // Add sample data
        if (chart.data && chart.data.length > 0) {
          doc.text('Sample Data:', 25, yPosition)
          yPosition += 6
          
          chart.data.slice(0, 5).forEach((item: any) => {
            if (yPosition > pageHeight - 20) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(`  • ${item.label}: ${item.value}`, 30, yPosition)
            yPosition += 5
          })
        }
        
        yPosition += 10
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
    
    // Generate blob with error handling
    let pdfBlob: Blob
    try {
      pdfBlob = doc.output('blob')
      console.log('PDF blob generated successfully, size:', pdfBlob.size)
    } catch (blobError) {
      console.error('PDF blob generation error:', blobError)
      throw new Error('Failed to generate PDF blob')
    }
    
  return pdfBlob
  } catch (error) {
    console.error('PDF export error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to generate PDF report: ${errorMessage}`)
  }
}

export async function exportToWord(options: ExportOptions): Promise<Blob> {
  try {
    const { title, companyName, clientName, content, analysis, charts } = options
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
                color: "2E86AB"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          // Header info
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
                size: 20
              })
            ],
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Company: ${companyName}`,
                size: 20
              })
            ],
            spacing: { after: 200 }
          }),
          
          ...(clientName ? [new Paragraph({
            children: [
              new TextRun({
                text: `Client: ${clientName}`,
                size: 20
              })
            ],
            spacing: { after: 400 }
          })] : []),
          
          // Executive Summary
          ...(analysis?.summary ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Executive Summary",
                  bold: true,
                  size: 24,
                  color: "2E86AB"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: analysis.summary,
                  size: 22
                })
              ],
              spacing: { after: 400 }
            })
          ] : []),
          
          // Insights
          ...(analysis?.insights && analysis.insights.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "AI Insights",
                  bold: true,
                  size: 24,
                  color: "2E86AB"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...analysis.insights.map((insight, index) => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${insight}`,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              })
            )
          ] : []),
          
          // Recommendations
          ...(analysis?.recommendations && analysis.recommendations.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "AI Recommendations",
                  bold: true,
                  size: 24,
                  color: "2E86AB"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...analysis.recommendations.map((rec, index) => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${rec}`,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              })
            )
          ] : []),
          
          // Statistics
          ...(analysis?.statistics && analysis.statistics.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Statistical Summary",
                  bold: true,
                  size: 24,
                  color: "2E86AB"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...analysis.statistics.map(stat => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${stat.column}: Count: ${stat.count} | Avg: ${typeof stat.average === 'number' ? stat.average.toFixed(2) : 'N/A'} | Min: ${stat.min || 'N/A'} | Max: ${stat.max || 'N/A'}`,
                    size: 20
                  })
                ],
                spacing: { after: 200 }
              })
            )
          ] : [])
        ]
      }]
    })
    
    const buffer = await Packer.toBuffer(doc)
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  } catch (error) {
    console.error('Word export error:', error)
    throw new Error('Failed to generate Word document')
  }
}

export async function exportToPowerPoint(options: ExportOptions): Promise<Blob> {
  try {
    const { title, companyName, clientName, analysis, charts } = options
    
    const pptx = new PptxGenJS()
    
    // Title slide
    const titleSlide = pptx.addSlide()
    titleSlide.addText(title, {
      x: 1,
      y: 1,
      w: 8,
      h: 2,
      fontSize: 32,
      bold: true,
      color: "2E86AB",
      align: "center"
    })
    titleSlide.addText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: 1,
      y: 3,
      w: 8,
      h: 1,
      fontSize: 18,
      align: "center"
    })
    titleSlide.addText(`Company: ${companyName}`, {
      x: 1,
      y: 4,
      w: 8,
      h: 1,
      fontSize: 18,
      align: "center"
    })
    if (clientName) {
      titleSlide.addText(`Client: ${clientName}`, {
        x: 1,
        y: 5,
        w: 8,
        h: 1,
        fontSize: 18,
        align: "center"
      })
    }
    
    // Executive Summary slide
    if (analysis?.summary) {
      const summarySlide = pptx.addSlide()
      summarySlide.addText("Executive Summary", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: "2E86AB"
      })
      summarySlide.addText(analysis.summary, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 16,
        valign: "top"
      })
    }
    
    // Insights slide
    if (analysis?.insights && analysis.insights.length > 0) {
      const insightsSlide = pptx.addSlide()
      insightsSlide.addText("AI Insights", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: "2E86AB"
      })
      
      const insightsText = analysis.insights.map((insight, index) => `${index + 1}. ${insight}`).join('\n\n')
      insightsSlide.addText(insightsText, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 14,
        valign: "top"
      })
    }
    
    // Recommendations slide
    if (analysis?.recommendations && analysis.recommendations.length > 0) {
      const recSlide = pptx.addSlide()
      recSlide.addText("AI Recommendations", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: "2E86AB"
      })
      
      const recText = analysis.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n\n')
      recSlide.addText(recText, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 14,
        valign: "top"
      })
    }
    
    // Statistics slide
    if (analysis?.statistics && analysis.statistics.length > 0) {
      const statsSlide = pptx.addSlide()
      statsSlide.addText("Statistical Summary", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: "2E86AB"
      })
      
      const statsText = analysis.statistics.map(stat => {
        const avgValue = typeof stat.average === 'number' ? stat.average.toFixed(2) : 'N/A'
        return `${stat.column}: Count: ${stat.count} | Avg: ${avgValue} | Min: ${stat.min || 'N/A'} | Max: ${stat.max || 'N/A'}`
      }).join('\n\n')
      
      statsSlide.addText(statsText, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 14,
        valign: "top"
      })
    }
    
    const buffer = await pptx.write('arraybuffer')
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
  } catch (error) {
    console.error('PowerPoint export error:', error)
    throw new Error('Failed to generate PowerPoint presentation')
  }
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}