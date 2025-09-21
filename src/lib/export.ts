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
    data: any
    title?: string
    insights?: string
  }>
  aiIntroduction?: string
  aiConclusion?: string
}

export async function exportToPDF(options: ExportOptions): Promise<Blob> {
  try {
    const { title, companyName, clientName, content, analysis, charts, aiIntroduction, aiConclusion } = options
    
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
    
    // Add AI Introduction
    if (aiIntroduction) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Analysis Introduction', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const introLines = doc.splitTextToSize(aiIntroduction, pageWidth - 40)
      introLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
      yPosition += 15
    }
    
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
        
        // Create PROPER chart visualization
        if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
          const chartWidth = pageWidth - 40
          const chartHeight = 80
          const chartData = chart.data.datasets[0].data
          const labels = chart.data.labels || []
          const maxValue = Math.max(...chartData)
          const minValue = Math.min(...chartData)
          
          // Check if we need a new page
          if (yPosition + chartHeight + 100 > pageHeight) {
            doc.addPage()
            yPosition = 20
          }
          
          // Draw chart background with border
          doc.setDrawColor(200, 200, 200)
          doc.setLineWidth(0.5)
          doc.rect(20, yPosition, chartWidth, chartHeight)
          
          // Add chart title
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text(`${chart.title} - ${chart.type.toUpperCase()} Chart`, 25, yPosition - 8)
          
          if (chart.type === 'bar') {
            // Draw proper bar chart
            const barWidth = Math.max(8, (chartWidth - 40) / Math.min(chartData.length, 10))
            const chartAreaHeight = chartHeight - 30
            const chartAreaY = yPosition + 15
            
            // Draw Y-axis
            doc.setDrawColor(0, 0, 0)
            doc.setLineWidth(1)
            doc.line(35, chartAreaY, 35, chartAreaY + chartAreaHeight)
            doc.line(35, chartAreaY + chartAreaHeight, 20 + chartWidth - 5, chartAreaY + chartAreaHeight)
            
            // Draw bars
            chartData.slice(0, 10).forEach((value: number, i: number) => {
              const barHeight = ((value - minValue) / (maxValue - minValue)) * (chartAreaHeight - 10)
              const x = 40 + (i * barWidth)
              const y = chartAreaY + chartAreaHeight - 10 - barHeight
              
              // Bar color based on value
              const intensity = (value - minValue) / (maxValue - minValue)
              if (intensity > 0.7) {
                doc.setFillColor(59, 130, 246) // Blue
              } else if (intensity > 0.4) {
                doc.setFillColor(16, 185, 129) // Green
              } else {
                doc.setFillColor(245, 158, 11) // Orange
              }
              doc.rect(x, y, barWidth - 2, barHeight, 'F')
              
              // Value label on top
              doc.setFontSize(8)
              doc.setFont('helvetica', 'normal')
              doc.text(value.toString(), x + barWidth/2 - 5, y - 3)
            })
            
            // Draw X-axis labels
            doc.setFontSize(8)
            chartData.slice(0, 10).forEach((value: number, i: number) => {
              const x = 40 + (i * barWidth)
              const label = labels[i] || `Item ${i + 1}`
              doc.text(label, x + barWidth/2 - 10, chartAreaY + chartAreaHeight + 8)
            })
            
          } else if (chart.type === 'pie') {
            // Draw proper pie chart representation
            const total = chartData.reduce((sum: number, value: number) => sum + value, 0)
            const centerX = 20 + chartWidth / 2
            const centerY = yPosition + chartHeight / 2
            const radius = Math.min(chartWidth, chartHeight) / 4
            
            // Draw pie slices as colored rectangles with percentages
            const colors = [
              [59, 130, 246], [16, 185, 129], [245, 158, 11], [239, 68, 68],
              [139, 92, 246], [6, 182, 212], [132, 204, 22], [249, 115, 22]
            ]
            
            let currentAngle = 0
            chartData.forEach((value: number, i: number) => {
              const percentage = (value / total) * 100
              const sliceAngle = (value / total) * 360
              const color = colors[i % colors.length]
              
              // Draw slice as colored rectangle
              const rectWidth = 15
              const rectHeight = (percentage / 100) * (chartHeight - 40)
              const x = 30 + (i * 20)
              const y = yPosition + 20 + (chartHeight - 40 - rectHeight)
              
              doc.setFillColor(color[0], color[1], color[2])
              doc.rect(x, y, rectWidth, rectHeight, 'F')
              
              // Add label and percentage
              const label = labels[i] || `Item ${i + 1}`
              doc.setFontSize(8)
              doc.setFont('helvetica', 'normal')
              doc.text(label, x, y + rectHeight + 8)
              doc.text(`${percentage.toFixed(1)}%`, x, y + rectHeight + 16)
            })
          }
          
          // Add chart statistics
          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
          doc.text(`Data Points: ${chartData.length} | Range: ${minValue} - ${maxValue}`, 25, yPosition + chartHeight + 25)
          
          yPosition += chartHeight + 50
        }
        
        // Add comprehensive chart analysis with proper spacing
        if (chart.insights) {
          // Check if we need a new page for analysis
          if (yPosition + 60 > pageHeight) {
            doc.addPage()
            yPosition = 20
          }
          
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          
          // Chart analysis header
          doc.setFont('helvetica', 'bold')
          doc.text('AI Analysis:', 25, yPosition)
          yPosition += 8
          
          // Main insights with proper line spacing
          doc.setFont('helvetica', 'normal')
          const insightLines = doc.splitTextToSize(chart.insights, pageWidth - 50)
          insightLines.forEach((line: string) => {
            if (yPosition > pageHeight - 40) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, 25, yPosition)
            yPosition += 6
          })
          
          yPosition += 5
          
          // Additional AI recommendations
          doc.setFont('helvetica', 'bold')
          doc.text('Key Takeaways:', 25, yPosition)
          yPosition += 8
          
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
    
    // Add AI Conclusion
    if (aiConclusion) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Analysis Conclusion', 20, yPosition)
      yPosition += 10
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const conclusionLines = doc.splitTextToSize(aiConclusion, pageWidth - 40)
      conclusionLines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
      yPosition += 15
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
            ...charts.flatMap((chart, index) => {
              const chartData = chart.data?.datasets?.[0]?.data || []
              const labels = chart.data?.labels || []
              const maxValue = chartData.length > 0 ? Math.max(...chartData) : 0
              const minValue = chartData.length > 0 ? Math.min(...chartData) : 0
              
              return [
                // Chart title
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${index + 1}. ${chart.title} - ${chart.type.toUpperCase()} Chart`,
                      bold: true,
                      size: 22,
                      color: "2E86AB"
                    })
                  ],
                  spacing: { before: 200, after: 100 }
                }),
                
                // Chart visualization
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `📊 CHART VISUALIZATION:\n`,
                      bold: true,
                      size: 20
                    })
                  ],
                  spacing: { after: 100 }
                }),
                
                // Chart data visualization
                new Paragraph({
                  children: [
                    new TextRun({
                      text: chart.type === 'bar' ? 
                        `BAR CHART DATA:\n${'='.repeat(50)}\n` +
                        chartData.slice(0, 10).map((value: number, i: number) => {
                          const barLength = Math.round((value / maxValue) * 30)
                          const bar = '█'.repeat(barLength)
                          const label = labels[i] || `Item ${i + 1}`
                          return `${label.padEnd(15)} |${bar.padEnd(30)}| ${value}`
                        }).join('\n') :
                        `PIE CHART DISTRIBUTION:\n${'='.repeat(50)}\n` +
                        chartData.map((value: number, i: number) => {
                          const total = chartData.reduce((sum: number, val: number) => sum + val, 0)
                          const percentage = ((value / total) * 100).toFixed(1)
                          const barLength = Math.round((value / total) * 30)
                          const bar = '█'.repeat(barLength)
                          const label = labels[i] || `Item ${i + 1}`
                          return `${label.padEnd(15)} |${bar.padEnd(30)}| ${percentage}%`
                        }).join('\n'),
                      size: 18,
                      font: "Courier New"
                    })
                  ],
                  spacing: { after: 100 }
                }),
                
                // Chart statistics
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `📈 STATISTICS: Data Points: ${chartData.length} | Range: ${minValue} - ${maxValue}`,
                      size: 18,
                      color: "666666"
                    })
                  ],
                  spacing: { after: 100 }
                }),
                
                // AI Analysis
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `🤖 AI ANALYSIS:\n${chart.insights || `This ${chart.type} chart visualizes the ${chart.title} data with ${chartData.length} data points.`}`,
                      size: 20
                    })
                  ],
                  spacing: { after: 100 }
                }),
                
                // Key Takeaways
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `💡 KEY TAKEAWAYS:\n• This ${chart.type} visualization reveals important data patterns\n• Use this insight to inform strategic decision-making\n• Monitor trends and patterns for business optimization`,
                      size: 20
                    })
                  ],
                  spacing: { after: 300 }
                })
              ]
            })
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
    
    // Charts slides with proper visuals
    if (charts && charts.length > 0) {
      charts.forEach((chart, index) => {
        const chartSlide = pptx.addSlide()
        const chartData = chart.data?.datasets?.[0]?.data || []
        const labels = chart.data?.labels || []
        const maxValue = chartData.length > 0 ? Math.max(...chartData) : 0
        const minValue = chartData.length > 0 ? Math.min(...chartData) : 0
        
        // Chart title
        chartSlide.addText(`${chart.title || 'Untitled Chart'} - ${chart.type.toUpperCase()} Chart`, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 24,
          bold: true,
          color: "2E86AB"
        })
        
        // Chart visualization
        let visualText = `📊 CHART VISUALIZATION:\n\n`
        
        if (chart.type === 'bar') {
          visualText += `BAR CHART DATA:\n${'='.repeat(40)}\n`
          chartData.slice(0, 8).forEach((value: number, i: number) => {
            const barLength = Math.round((value / maxValue) * 25)
            const bar = '█'.repeat(barLength)
            const label = labels[i] || `Item ${i + 1}`
            visualText += `${label.padEnd(12)} |${bar.padEnd(25)}| ${value}\n`
          })
        } else if (chart.type === 'pie') {
          const total = chartData.reduce((sum: number, value: number) => sum + value, 0)
          visualText += `PIE CHART DISTRIBUTION:\n${'='.repeat(40)}\n`
          chartData.forEach((value: number, i: number) => {
            const percentage = ((value / total) * 100).toFixed(1)
            const barLength = Math.round((value / total) * 25)
            const bar = '█'.repeat(barLength)
            const label = labels[i] || `Item ${i + 1}`
            visualText += `${label.padEnd(12)} |${bar.padEnd(25)}| ${percentage}%\n`
          })
        }
        
        visualText += `\n📈 STATISTICS: Data Points: ${chartData.length} | Range: ${minValue} - ${maxValue}`
        
        chartSlide.addText(visualText, {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 3.5,
          fontSize: 14,
          valign: "top"
        })
        
        // AI Analysis
        chartSlide.addText(`🤖 AI ANALYSIS:\n${chart.insights || `This ${chart.type} chart visualizes the data with ${chartData.length} data points.`}`, {
          x: 0.5,
          y: 5,
          w: 9,
          h: 2,
          fontSize: 16,
          valign: "top"
        })
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