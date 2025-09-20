import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ExportOptions {
  title: string
  companyName: string
  clientName?: string
  content: string
  charts?: Array<{
    id: string
    type: string
    title: string
    data: any[]
  }>
}

export async function exportToPDF(options: ExportOptions): Promise<Blob> {
  const { title, companyName, clientName, content } = options
  
  // Create a new PDF document
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Add title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, 30)
  
  // Add company and client info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(companyName, 20, 45)
  if (clientName) {
    doc.text(`Client: ${clientName}`, 20, 55)
  }
  
  // Add date
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65)
  
  // Add content
  doc.setFontSize(11)
  const lines = doc.splitTextToSize(content, 170)
  doc.text(lines, 20, 85)
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`Page ${i} of ${pageCount}`, 20, 285)
  }
  
  // Generate blob
  const pdfBlob = doc.output('blob')
  return pdfBlob
}

export async function exportToWord(options: ExportOptions): Promise<Blob> {
  // For now, return a simple text file
  // In production, you would use the docx library
  const { title, companyName, clientName, content } = options
  
  const wordContent = `
${title}
${companyName}
${clientName ? `Client: ${clientName}` : ''}
Generated on: ${new Date().toLocaleDateString()}

${content}
  `.trim()
  
  const blob = new Blob([wordContent], { type: 'text/plain' })
  return blob
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

