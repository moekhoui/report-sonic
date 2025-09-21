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

    
    // Add charts section with visual charts
    if (charts && charts.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Data Visualizations', 20, yPosition)
      yPosition += 15
      
      charts.forEach((chart, index) => {
        if (yPosition > pageHeight - 60) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${chart.title}`, 20, yPosition)
        yPosition += 8
        
        // Create enhanced chart visualization based on chart type
        if (chart.data && chart.data.length > 0) {
          const chartWidth = pageWidth - 40
          const chartHeight = 50
          const maxValue = Math.max(...chart.data.map((item: any) => item.value))
          const minValue = Math.min(...chart.data.map((item: any) => item.value))
          
          // Draw chart background with border
          doc.setDrawColor(100, 100, 100)
          doc.setLineWidth(0.5)
          doc.rect(20, yPosition, chartWidth, chartHeight)
          
          // Add chart title
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text(`Chart Type: ${chart.type.toUpperCase()}`, 22, yPosition - 5)
          
          if (chart.type === 'bar') {
            // Draw bars with enhanced styling
            const barWidth = (chartWidth - 20) / chart.data.length
            chart.data.forEach((item: any, i: number) => {
              const barHeight = ((item.value - minValue) / (maxValue - minValue)) * (chartHeight - 20)
              const x = 30 + (i * barWidth)
              const y = yPosition + chartHeight - 10 - barHeight
              
              // Bar color based on value (gradient effect)
              const intensity = (item.value - minValue) / (maxValue - minValue)
              if (intensity > 0.7) {
                doc.setFillColor(52, 134, 171) // Blue for high values
              } else if (intensity > 0.4) {
                doc.setFillColor(46, 125, 50) // Green for medium values
              } else {
                doc.setFillColor(255, 152, 0) // Orange for low values
              }
              doc.rect(x + 1, y, barWidth - 2, barHeight, 'F')
              
              // Value label on top of bar
              doc.setFontSize(7)
              doc.setFont('helvetica', 'normal')
              doc.text(item.value.toString(), x + barWidth/2 - 3, y - 2)
            })
          } else if (chart.type === 'line') {
            // Draw line chart
            doc.setDrawColor(52, 134, 171)
            doc.setLineWidth(1)
            const pointWidth = (chartWidth - 20) / (chart.data.length - 1)
            for (let i = 0; i < chart.data.length - 1; i++) {
              const x1 = 30 + (i * pointWidth)
              const y1 = yPosition + chartHeight - 10 - ((chart.data[i].value - minValue) / (maxValue - minValue)) * (chartHeight - 20)
              const x2 = 30 + ((i + 1) * pointWidth)
              const y2 = yPosition + chartHeight - 10 - ((chart.data[i + 1].value - minValue) / (maxValue - minValue)) * (chartHeight - 20)
              doc.line(x1, y1, x2, y2)
            }
            
            // Draw data points
            chart.data.forEach((item: any, i: number) => {
              const x = 30 + (i * pointWidth)
              const y = yPosition + chartHeight - 10 - ((item.value - minValue) / (maxValue - minValue)) * (chartHeight - 20)
              doc.setFillColor(52, 134, 171)
              doc.circle(x, y, 1, 'F')
            })
          } else if (chart.type === 'pie') {
            // Draw pie chart representation (simplified as bar chart)
            const total = chart.data.reduce((sum: number, item: any) => sum + item.value, 0)
            let currentAngle = 0
            const centerX = 20 + chartWidth / 2
            const centerY = yPosition + chartHeight / 2
            const radius = Math.min(chartWidth, chartHeight) / 4
            
            chart.data.forEach((item: any, i: number) => {
              const sliceAngle = (item.value / total) * 360
              const color = i % 3 === 0 ? [52, 134, 171] : i % 3 === 1 ? [46, 125, 50] : [255, 152, 0]
              doc.setFillColor(color[0], color[1], color[2])
              // Simplified pie representation as colored rectangles
              const rectHeight = (item.value / total) * (chartHeight - 20)
              doc.rect(30 + i * 15, yPosition + 10, 12, rectHeight, 'F')
            })
          }
          
          // Draw axis labels
          doc.setFontSize(7)
          doc.setFont('helvetica', 'normal')
          chart.data.forEach((item: any, i: number) => {
            const x = 30 + (i * (chartWidth - 20) / chart.data.length)
            doc.text(item.label, x, yPosition + chartHeight + 5)
          })
          
          // Add value range info
          doc.setFontSize(8)
          doc.text(`Range: ${minValue} - ${maxValue}`, 20, yPosition + chartHeight + 15)
          
          yPosition += chartHeight + 30
        }
        
        // Add comprehensive chart analysis
        if (chart.insights) {
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          
          // Chart analysis header
          doc.setFont('helvetica', 'bold')
          doc.text('AI Analysis:', 25, yPosition)
          yPosition += 6
          
          // Main insights
          doc.setFont('helvetica', 'normal')
          const insightLines = doc.splitTextToSize(chart.insights, pageWidth - 40)
          insightLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, 25, yPosition)
            yPosition += 5
          })
          
          // Additional AI recommendations
          doc.setFont('helvetica', 'bold')
          doc.text('Key Takeaways:', 25, yPosition)
          yPosition += 6
          
          doc.setFont('helvetica', 'normal')
          const takeaways = [
            `• This ${chart.type} visualization reveals important data patterns`,
            `• Use this insight to inform strategic decision-making`,
            `• Consider monitoring trends over time for deeper analysis`,
            `• Data quality and consistency are crucial for accurate insights`
          ]
          
          takeaways.forEach((takeaway: string) => {
            if (yPosition > pageHeight - 20) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(takeaway, 25, yPosition)
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
          ] : []),
          
          // Charts section
          ...(charts && charts.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Data Visualizations",
                  bold: true,
                  size: 24,
                  color: "2E86AB"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...charts.map((chart, index) => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${chart.title}`,
                    bold: true,
                    size: 22,
                    color: "2E86AB"
                  })
                ],
                spacing: { before: 200, after: 100 }
              })
            ),
            ...charts.map((chart, index) => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Chart Type: ${chart.type} | Data Points: ${chart.data?.length || 0}`,
                    size: 20,
                    color: "666666"
                  })
                ],
                spacing: { after: 100 }
              })
            ),
            ...charts.map((chart, index) => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: chart.insights || `This ${chart.type} chart visualizes the ${chart.title} data with ${chart.data?.length || 0} data points.`,
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
    
    // Charts slides
    if (charts && charts.length > 0) {
      charts.forEach((chart, index) => {
        const chartSlide = pptx.addSlide()
        
        // Chart title
        chartSlide.addText(chart.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 24,
          bold: true,
          color: "2E86AB"
        })
        
        // Chart description
        chartSlide.addText(chart.insights || `This ${chart.type} chart visualizes the data with ${chart.data?.length || 0} data points.`, {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 1,
          fontSize: 16,
          color: "666666"
        })
        
        // Chart data table
        if (chart.data && chart.data.length > 0) {
          const chartDataText = chart.data.slice(0, 8).map((item, i) => 
            `${item.label}: ${item.value}`
          ).join('\n')
          
          chartSlide.addText(chartDataText, {
            x: 0.5,
            y: 2.5,
            w: 9,
            h: 3,
            fontSize: 14,
            valign: "top"
          })
        }
      })
    }
    
    const buffer = await pptx.write({ outputType: 'arraybuffer' } as any)
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