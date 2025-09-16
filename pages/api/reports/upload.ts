import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import xlsx from 'xlsx'
import path from 'path'
import fs from 'fs'

// Configure multer for file upload
const upload = multer({
  dest: '/tmp/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'))
    }
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Handle file upload
    await new Promise((resolve, reject) => {
      upload.single('file')(req as any, res as any, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })

    const file = (req as any).file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('📊 Processing file:', file.originalname)

    // Read and parse the Excel file
    const workbook = xlsx.readFile(file.path)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

    // Clean up uploaded file
    fs.unlinkSync(file.path)

    // Generate AI analysis
    const analysis = generateAIAnalysis(data)

    // Create report
    const report = {
      id: Date.now().toString(),
      name: file.originalname,
      data: data,
      analysis: analysis,
      createdAt: new Date().toISOString(),
      status: 'completed'
    }

    console.log('✅ Report generated successfully')

    return res.status(200).json({
      success: true,
      report: report
    })

  } catch (error: any) {
    console.error('❌ Upload error:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to process file' 
    })
  }
}

function generateAIAnalysis(data: any[]) {
  if (!data || data.length === 0) {
    return {
      summary: 'No data found in the uploaded file',
      insights: [],
      recommendations: []
    }
  }

  const headers = data[0] as string[]
  const rows = data.slice(1)
  
  // Basic analysis
  const totalRows = rows.length
  const totalColumns = headers.length
  
  // Find numeric columns
  const numericColumns = headers.filter((header, index) => {
    return rows.some(row => !isNaN(Number(row[index])))
  })

  // Calculate basic statistics for numeric columns
  const statistics = numericColumns.map(column => {
    const columnIndex = headers.indexOf(column)
    const values = rows.map(row => Number(row[columnIndex])).filter(val => !isNaN(val))
    
    if (values.length === 0) return null
    
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    return {
      column,
      count: values.length,
      sum,
      average: avg,
      max,
      min
    }
  }).filter((stat): stat is NonNullable<typeof stat> => stat !== null)

  // Generate insights
  const insights = []
  
  if (totalRows > 1000) {
    insights.push(`Large dataset with ${totalRows} rows - great for comprehensive analysis`)
  }
  
  if (numericColumns.length > 0) {
    insights.push(`Found ${numericColumns.length} numeric columns suitable for statistical analysis`)
  }
  
  if (statistics.length > 0) {
    const highestAvg = statistics.reduce((max, stat) => 
      stat.average > max.average ? stat : max
    )
    insights.push(`Column '${highestAvg.column}' has the highest average value of ${highestAvg.average.toFixed(2)}`)
  }

  // Generate recommendations
  const recommendations = []
  
  if (numericColumns.length >= 2) {
    recommendations.push('Consider creating correlation analysis between numeric columns')
  }
  
  if (totalRows > 100) {
    recommendations.push('Large dataset - consider creating trend analysis and forecasting')
  }
  
  recommendations.push('Create visualizations to better understand data patterns')
  recommendations.push('Export report as PDF for sharing with stakeholders')

  return {
    summary: `Analyzed ${totalRows} rows across ${totalColumns} columns. Found ${numericColumns.length} numeric columns for statistical analysis.`,
    insights,
    recommendations,
    statistics
  }
}
